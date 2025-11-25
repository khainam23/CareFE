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
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { validateCustomerForm } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import DatePickerInput from '@/components/DatePickerInput';

const CUSTOMER_STEPS = [
  {
    id: 1,
    title: 'Thông tin cá nhân',
    description: 'Tên đầy đủ, ngày sinh, giới tính',
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
    title: 'Thông tin người cần chăm sóc',
    description: 'Họ tên, ngày sinh, giới tính, số điện thoại, ghi chú',
  },
];

export default function CustomerSignUp({
  currentStep,
  onNextStep,
  onPrevStep,
  onBack,
}) {
  const navigate = useNavigate();
  const { registerCustomer, loading } = useAuthStore();
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
    // Emergency contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Care recipients (array)
    careRecipients: [
      {
        name: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        specialNotes: ''
      }
    ]
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
      alert('Vui lòng đồng ý với điều khoản và chính sách');
      return;
    }

    // Prepare data for API (matching backend requirements)
    const customerData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: `${formData.address}, ${formData.ward}, ${formData.city}`.trim(),
      emergencyContactName: formData.emergencyContactName || undefined,
      emergencyContactPhone: formData.emergencyContactPhone || undefined,
      // Care recipients array (filter out empty entries)
      careRecipients: formData.careRecipients.filter(recipient => 
        recipient.name.trim() || recipient.phoneNumber.trim()
      ).map(recipient => ({
        name: recipient.name.trim(),
        dateOfBirth: recipient.dateOfBirth || undefined,
        gender: recipient.gender || undefined,
        phoneNumber: recipient.phoneNumber.trim() || undefined,
        specialNotes: recipient.specialNotes.trim() || undefined
      }))
    };

    // Validate form
    const validation = validateCustomerForm(customerData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const response = await registerCustomer(customerData);
      if (response.success) {
        alert('Đăng ký thành công! Bạn có thể đặt dịch vụ ngay bây giờ.');
        navigate('/dashboard'); // Redirect to dashboard or home
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8 align-center">
        <div className="flex items-center gap-2">
          {CUSTOMER_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.id
                    ? 'bg-blue-500 '
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < CUSTOMER_STEPS.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content - All sections visible */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[0].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[0].description}
          </p>
          <Step1Customer 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        </div>

        {/* Section 2: Account Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[1].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[1].description}
          </p>
          <Step2Customer 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>

        {/* Section 3: Contact Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[2].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[2].description}
          </p>
          <Step3Customer 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors} 
          />
        </div>

        {/* Section 4: Address */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[3].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[3].description}
          </p>
          <Step4Customer 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors}
          />
        </div>

        {/* Section 5: Care Recipient Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[4].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[4].description}
          </p>
          <Step5Customer 
            formData={formData} 
            onChange={handleInputChange} 
            errors={errors}
            setFormData={setFormData}
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded cursor-pointer"
          />
          <label htmlFor="terms" className="cursor-pointer text-sm text-gray-700">
            Tôi đồng ý với
            <a href="#" className="text-blue-500 hover:text-blue-600 mx-1">
              điều khoản dịch vụ
            </a>
            và
            <a href="#" className="text-blue-500 hover:text-blue-600 mx-1">
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
            className={`px-6 py-2  transition rounded-lg ${
              agreedToTerms && !loading
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
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

function Step1Customer({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      {/* Ô nhập tên */}
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
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nguyễn Văn A"
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      {/* Hàng chứa ngày sinh + giới tính */}
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2Customer({ formData, onChange, errors, showPassword, setShowPassword }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Tên đăng nhập</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange('username', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="username"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Mật khẩu *</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onChange('password', e.target.value)}
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
  );
}

function Step3Customer({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
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
          <label className="block mb-2 text-sm font-medium">Số điện thoại *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
      
      {/* Emergency Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Tên người liên hệ khẩn cấp</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => onChange('emergencyContactName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nguyễn Thị B"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">SĐT người liên hệ khẩn cấp</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => onChange('emergencyContactPhone', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="0987654321"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Customer({ formData, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Phường</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => onChange('ward', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Phường 1"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            Tỉnh - Thành phố
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Hà Nội"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Địa chỉ cụ thể</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="123 Đường ABC"
          />
        </div>
      </div>
    </div>
  );
}

function Step5Customer({ formData, onChange, errors, setFormData }) {
  const addCareRecipient = () => {
    setFormData(prev => ({
      ...prev,
      careRecipients: [
        ...prev.careRecipients,
        {
          name: '',
          dateOfBirth: '',
          gender: '',
          phoneNumber: '',
          specialNotes: ''
        }
      ]
    }));
  };

  const removeCareRecipient = (index) => {
    if (formData.careRecipients.length > 1) {
      setFormData(prev => ({
        ...prev,
        careRecipients: prev.careRecipients.filter((_, i) => i !== index)
      }));
    }
  };

  const updateCareRecipient = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      careRecipients: prev.careRecipients.map((recipient, i) =>
        i === index ? { ...recipient, [field]: value } : recipient
      )
    }));
  };

  return (
    <div className="space-y-6">
      {formData.careRecipients.map((recipient, index) => (
        <div
          key={index}
          className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-700">
              Người cần chăm sóc {index + 1}
            </h3>
            {formData.careRecipients.length > 1 && (
              <button
                type="button"
                onClick={() => removeCareRecipient(index)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 transition bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Họ và tên người cần chăm sóc
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={recipient.name}
                  onChange={(e) => updateCareRecipient(index, 'name', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nguyễn Văn B"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <DatePickerInput
                    value={recipient.dateOfBirth}
                    onChange={(value) => updateCareRecipient(index, 'dateOfBirth', value)}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Giới tính</label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={recipient.gender}
                    onChange={(e) => updateCareRecipient(index, 'gender', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={recipient.phoneNumber}
                  onChange={(e) => updateCareRecipient(index, 'phoneNumber', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Chi tiết đặc biệt cần lưu ý
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <textarea
                  value={recipient.specialNotes}
                  onChange={(e) => updateCareRecipient(index, 'specialNotes', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Mô tả các thông tin đặc biệt..."
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addCareRecipient}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-blue-600 transition bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-100 hover:border-blue-400"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Thêm người cần chăm sóc</span>
      </button>
    </div>
  );
}
