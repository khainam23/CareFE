import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { validateEmail, validatePassword } from '../../utils/validation';
import CareNowLogo from '@assets/images/Logo.svg';
import ImageBg from '@assets/images/Rectangle 105.svg';
import Im15 from '@assets/images/image 15.svg';


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
    // Khôi phục thông tin đăng nhập nếu có remember me
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (savedEmail && savedRememberMe) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Hàm điều hướng theo vai trò
  const redirectByRole = (userData) => {
    console.log('=== REDIRECT BY ROLE ===');
    console.log('User data:', userData);
    
    // Backend trả về roles là array với format ROLE_XXX, lấy role đầu tiên
    const roleWithPrefix = userData.roles?.[0] || userData.role;
    console.log('User role with prefix:', roleWithPrefix);

    if (!roleWithPrefix) {
      console.error('No role found for user');
      navigate('/', { replace: true });
      return;
    }

    // Loại bỏ prefix "ROLE_" nếu có
    const role = roleWithPrefix.replace('ROLE_', '').toLowerCase();
    console.log('Processed role:', role);
    console.log('Will redirect to role:', role);

    // Sử dụng navigate với replace để không tạo history entry
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'support':
        navigate('/support/dashboard', { replace: true });
        break;
      case 'caregiver':
        navigate('/employee-profile', { replace: true });
        break;
      case 'customer':
        navigate('/', { replace: true });
        break;
      default:
        console.warn('Unknown role, redirecting to home:', role);
        navigate('/', { replace: true });
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
      console.log('=== LOGIN ATTEMPT ===');
      console.log('Credentials:', formData.email);
      
      const response = await login(formData);
      
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Success:', response.success);
      console.log('Data:', response.data);
      console.log('User roles:', response.data?.roles);
      
      // Kiểm tra localStorage sau khi login
      console.log('=== LOCALSTORAGE CHECK ===');
      console.log('Token exists:', !!localStorage.getItem('token'));
      console.log('User exists:', !!localStorage.getItem('user'));
      console.log('User data:', localStorage.getItem('user'));

      if (response.success) {
        // Xử lý ghi nhớ đăng nhập
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }

        // Verify localStorage was saved
        console.log('=== VERIFY LOCALSTORAGE BEFORE REDIRECT ===');
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        console.log('Saved token:', savedToken ? savedToken.substring(0, 20) + '...' : 'NULL');
        console.log('Saved user:', savedUser);
        
        if (!savedToken || !savedUser) {
          console.error('=== CRITICAL: LocalStorage not saved! ===');
          alert('Lỗi: Không thể lưu thông tin đăng nhập. Vui lòng thử lại.');
          return;
        }

        // Đợi một chút để đảm bảo localStorage được flush
        console.log('=== WAITING BEFORE REDIRECT ===');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('=== REDIRECTING ===');
        console.log('About to redirect with data:', response.data);
        redirectByRole(response.data);
      } else {
        // Trường hợp response không success
        console.error('Login failed:', response.message);
        alert(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      alert(error.message || 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundImage: `url(${Im15})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8">
            <a href="/">
              <img src={CareNowLogo} alt="CareNow" className="h-48" />
            </a>
          </div>
          <div className="relative w-full max-w-lg mx-auto">
            <img
              src={ImageBg}
              alt="Healthcare illustration"
            />
            <div className="absolute inset-1 flex items-end justify-center p-6 -rotate-12">
              <p className="text-center bottom-0 bg-white font-medium text-lg rounded-md p-4">
                Để đăng tìm chuyên viên chăm sóc, hỗ trợ điều dưỡng tại nhà & bệnh viện
              </p>
            </div>

            <div className="absolute h-fit flex bg-green-200 items-center justify-center p-6 pb-12 rotate-12" style={{ top: "88%", right: "-88%" }}>
              <p className="text-center bottom-0 bg-gray-500  font-medium text-lg rounded-md p-4 pb-8">
                Theo dõi sức khỏe hỗ trỡ điều dưỡng
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white rounded-2xl p-8 max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Đăng Nhập
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Nhớ mật khẩu
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white px-4 border border-transparent text-sm font-semibold rounded-lg  transition-colors ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="relative pt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#3B82F6" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 c0-3.331,2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.461,2.268,15.365,1,12.545,1 C6.777,1,2,5.777,2,11.545c0,5.768,4.777,10.545,10.545,10.545c10.545,0,10.545-6.033,10.545-6.032 C22.545,11.305,22.455,10.771,12.545,10.239z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 pt-4">
            Chưa có tài khoản? {' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}