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
} from 'lucide-react';
import {useState} from 'react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Vui lòng đồng ý với điều khoản và chính sách');
      return;
    }
    if (currentStep < CUSTOMER_STEPS.length) {
      onNextStep();
    } else {
      // Submit form logic here
      console.log('Submit customer signup');
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
                    ? 'bg-blue-500 text-white'
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
          <Step1Customer />
        </div>

        {/* Section 2: Account Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[1].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[1].description}
          </p>
          <Step2Customer />
        </div>

        {/* Section 3: Contact Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[2].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[2].description}
          </p>
          <Step3Customer />
        </div>

        {/* Section 4: Address */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[3].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[3].description}
          </p>
          <Step4Customer />
        </div>

        {/* Section 5: Care Recipient Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[4].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {CUSTOMER_STEPS[4].description}
          </p>
          <Step5Customer />
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
            disabled={!agreedToTerms}
            className={`px-6 py-2 text-white transition rounded-lg ${
              agreedToTerms
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Hoàn tất
          </button>
        </div>
      </form>
    </div>
  );
}

function Step1Customer() {
  return (
    <div className="space-y-4">
      {/* Ô nhập tên */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tên đầy đủ
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nguyễn Văn A"
          />
        </div>
      </div>

      {/* Hàng chứa ngày sinh + giới tính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Giới tính
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            <select className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
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

function Step2Customer() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Tên đăng nhập</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="username"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Mật khẩu</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
      </div>
    </div>
  );
}

function Step3Customer() {
  return (
    <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
      <div>
        <label className="block mb-2 text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="email@example.com"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Số điện thoại</label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="0123456789"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Customer() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Phường</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="123 Đường ABC"
          />
        </div>
      </div>
    </div>
  );
}

function Step5Customer() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">
          Họ và tên người cần chăm sóc
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Nguyễn Văn B"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Ngày sinh</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Giới tính</label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            <select className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Mô tả các thông tin đặc biệt..."
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
