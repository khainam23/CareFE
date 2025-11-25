import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { validateEmail, validatePassword } from '../../utils/validation';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({}); 

  // Kiểm tra nếu đã đăng nhập thì redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user);
    }
    
    // Khôi phục thông tin đăng nhập nếu có remember me
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && savedRememberMe) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, [isAuthenticated, user, navigate]);

  // Hàm điều hướng theo vai trò
  const redirectByRole = (userData) => {
    console.log('Redirecting user with data:', userData);
    // Backend trả về roles là array với format ROLE_XXX, lấy role đầu tiên
    const roleWithPrefix = userData.roles?.[0] || userData.role;
    console.log('User role with prefix:', roleWithPrefix);
    
    if (!roleWithPrefix) {
      console.error('No role found for user');
      navigate('/');
      return;
    }
    
    // Loại bỏ prefix "ROLE_" nếu có
    const role = roleWithPrefix.replace('ROLE_', '').toLowerCase();
    console.log('Processed role:', role);
    
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'support':
        navigate('/support/dashboard');
        break;
      case 'caregiver':
        navigate('/employee-profile');
        break;
      case 'customer':
        navigate('/');
        break;
      default:
        console.warn('Unknown role, redirecting to home:', role);
        navigate('/');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const fillTestAccount = (email, password) => {
    setFormData({ email, password });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login(formData);
      console.log('Login response:', response);
      
      if (response.success) {
        // Xử lý ghi nhớ đăng nhập
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }
        
        // Điều hướng theo vai trò
        redirectByRole(response.data);
      } else {
        // Trường hợp response không success
        alert(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              tạo tài khoản mới
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu *
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 active:bg-black'
              }`}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>

        {/* Test accounts info */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Tài khoản test có sẵn:</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>
              <button 
                onClick={() => fillTestAccount('admin@careservice.com', 'admin123')}
                className="text-blue-600 hover:text-blue-800 underline transition-colors hover:bg-blue-50 px-2 py-1 rounded"
              >
                <strong>Admin:</strong> admin@careservice.com / admin123
              </button>
            </p>
            <p>
              <button 
                onClick={() => fillTestAccount('support@careservice.com', 'support123')}
                className="text-blue-600 hover:text-blue-800 underline transition-colors hover:bg-blue-50 px-2 py-1 rounded"
              >
                <strong>Support:</strong> support@careservice.com / support123
              </button>
            </p>
            <p>
              <button 
                onClick={() => fillTestAccount('customer@example.com', 'customer123')}
                className="text-blue-600 hover:text-blue-800 underline transition-colors hover:bg-blue-50 px-2 py-1 rounded"
              >
                <strong>Customer:</strong> customer@example.com / customer123
              </button>
            </p>
            <p>
              <button 
                onClick={() => fillTestAccount('caregiver@example.com', 'caregiver123')}
                className="text-blue-600 hover:text-blue-800 underline transition-colors hover:bg-blue-50 px-2 py-1 rounded"
              >
                <strong>Caregiver:</strong> caregiver@example.com / caregiver123
              </button>
            </p>
          </div>
          <div className="mt-2 text-xs text-yellow-600">
            <p>💡 Click vào tài khoản để tự động điền thông tin</p>
          </div>
        </div>
      </div>
    </div>
  );
}