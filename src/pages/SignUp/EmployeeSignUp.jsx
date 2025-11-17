import {
  User,
  Calendar,
  Users,
  Lock,
  Mail,
  Phone,
  MapPin,
  FileText,
  Eye,
  EyeOff,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../store/authStore';
import { validateCaregiverForm } from '../../utils/validation';
import DatePickerInput from '@/components/DatePickerInput';

const EMPLOYEE_STEPS = [
  {
    id: 1,
    title: 'Thông tin cá nhân',
    description: 'Tên đầy đủ, ngày sinh, giới tính, ảnh đại diện, ảnh CCCD',
  },
  {
    id: 2,
    title: 'Thông tin tài khoản',
    description: 'Tên đăng nhập, mật khẩu',
  },
  { id: 3, title: 'Thông tin liên hệ', description: 'Email, số điện thoại' },
  {
    id: 4,
    title: 'Địa chỉ của bạn',
    description: 'Phường, tỉnh - thành phố, địa chỉ cụ thể',
  },
  {
    id: 5,
    title: 'Tùy chọn công việc',
    description: 'Số năm kinh nghiệm, loại hình công việc, CV',
  },
];

export default function EmployeeSignUp({ onBack, onComplete }) {
  const navigate = useNavigate();
  const { registerCaregiver, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Personal info
    fullName: '',
    dateOfBirth: '',
    gender: '',
    // Account info
    username: '',
    password: '',
    // Contact info
    email: '',
    phoneNumber: '',
    // Address
    ward: '',
    city: '',
    address: '',
    // ID Card
    idCardNumber: '',
    // Professional info
    bio: '',
    skills: '',
    yearsOfExperience: 0,
    certifications: '',
    jobType: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đồng ý',
        text: 'Vui lòng đồng ý với điều khoản và chính sách',
        confirmButtonColor: '#22c55e',
      });
      return;
    }

    // Prepare data for API (matching backend requirements)
    const caregiverData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: `${formData.address}, ${formData.ward}, ${formData.city}`.trim(),
      idCardNumber: formData.idCardNumber,
      bio: formData.bio || undefined,
      skills: formData.skills || undefined,
      yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
      certifications: formData.certifications || undefined
    };

    // Validate form
    const validation = validateCaregiverForm(caregiverData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi validation',
        text: 'Vui lòng kiểm tra lại thông tin đã nhập',
        confirmButtonColor: '#22c55e',
      });
      return;
    }

    try {
      const response = await registerCaregiver(caregiverData);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          text: 'Hồ sơ của bạn đang được xem xét. Chúng tôi sẽ liên hệ sớm.',
          confirmButtonColor: '#22c55e',
        }).then(() => {
          navigate('/dashboard'); // Redirect to dashboard
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi đăng ký',
        text: error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
        confirmButtonColor: '#22c55e',
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8 align-center">
        <div className="flex items-center gap-2">
          {EMPLOYEE_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index === 0
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < EMPLOYEE_STEPS.length - 1 && (
                <div className="w-12 h-1 mx-2 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Information */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[0].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[0].description}
          </p>
          <Step1Employee 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        </div>

        {/* Section 2: Account Information */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[1].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[1].description}
          </p>
          <Step2Employee 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors}
            showPassword={showPassword} 
            setShowPassword={setShowPassword} 
          />
        </div>

        {/* Section 3: Contact Information */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[2].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[2].description}
          </p>
          <Step3Employee 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        </div>

        {/* Section 4: Address */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[3].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[3].description}
          </p>
          <Step4Employee 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        </div>

        {/* Section 5: Job Options */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[4].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[4].description}
          </p>
          <Step5Employee 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded cursor-pointer"
          />
          <label htmlFor="terms" className="cursor-pointer text-sm text-gray-700">
            Tôi đồng ý với
            <a href="#" className="text-green-500 hover:text-green-600 mx-1">
              điều khoản dịch vụ
            </a>
            và
            <a href="#" className="text-green-500 hover:text-green-600 mx-1">
              chính sách bảo mật
            </a>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={!agreedToTerms || loading}
            className={`px-6 py-2 text-white transition rounded-lg ${
              agreedToTerms && !loading
                ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Hoàn tất'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Step1Employee({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      {/* Tên đầy đủ */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tên đầy đủ *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nguyễn Văn A"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      {/* Số CCCD/CMND */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Số CCCD/CMND *
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.idCardNumber}
            onChange={(e) => onChange('idCardNumber', e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
              errors.idCardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="079123456789"
          />
        </div>
        {errors.idCardNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.idCardNumber}</p>
        )}
      </div>

      {/* Ngày sinh + Giới tính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <DatePickerInput
              value={formData.dateOfBirth}
              onChange={(value) => onChange('dateOfBirth', value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Giới tính
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            <select 
              value={formData.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
      </div>

      {/* File uploads - Note: File upload will need separate handling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ảnh đại diện
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Tính năng upload sẽ được bổ sung sau</p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ảnh CCCD/CMND
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Tính năng upload sẽ được bổ sung sau</p>
        </div>
      </div>
    </div>
  );
}

function Step2Employee({ formData, onChange, errors, showPassword, setShowPassword }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tên đăng nhập
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange('username', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="username"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Mật khẩu *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
  );
}

function Step3Employee({ formData, onChange, errors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Số điện thoại *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0123456789"
          />
        </div>
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
        )}
      </div>
    </div>
  );
}

function Step4Employee({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phường
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => onChange('ward', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Phường 1"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tỉnh - Thành phố
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Hà Nội"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Địa chỉ cụ thể *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Đường ABC"
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>
    </div>
  );
}

function Step5Employee({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Số năm kinh nghiệm
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={formData.yearsOfExperience}
            onChange={(e) => onChange('yearsOfExperience', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Giới thiệu bản thân
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <textarea
            value={formData.bio}
            onChange={(e) => onChange('bio', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Tôi có 5 năm kinh nghiệm chăm sóc người cao tuổi..."
            rows="3"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Kỹ năng chuyên môn
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => onChange('skills', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Chăm sóc người già, Điều dưỡng cơ bản, Vật lý trị liệu"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Chứng chỉ
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.certifications}
            onChange={(e) => onChange('certifications', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Chứng chỉ Điều dưỡng viên, Chứng chỉ Sơ cấp cứu"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Loại hình công việc bạn muốn
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          <select 
            value={formData.jobType}
            onChange={(e) => onChange('jobType', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none"
          >
            <option value="">Chọn loại hình công việc</option>
            <option value="fulltime">Toàn thời gian</option>
            <option value="parttime">Bán thời gian</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Upload CV
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Tính năng upload sẽ được bổ sung sau</p>
      </div>
    </div>
  );
}

export { Step1Employee, Step2Employee, Step3Employee, Step4Employee, Step5Employee };