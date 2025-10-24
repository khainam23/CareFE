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
import Swal from 'sweetalert2';

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
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
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
    // Submit form logic here
    console.log('Submit employee signup');
    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Thông tin cá nhân đã được lưu. Tiếp tục tới bước tiếp theo...',
      confirmButtonColor: '#22c55e',
    });
    onComplete?.();
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
          <Step1Employee />
        </div>

        {/* Section 2: Account Information */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[1].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[1].description}
          </p>
          <Step2Employee showPassword={showPassword} setShowPassword={setShowPassword} />
        </div>

        {/* Section 3: Contact Information */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[2].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[2].description}
          </p>
          <Step3Employee />
        </div>

        {/* Section 4: Address */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[3].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[3].description}
          </p>
          <Step4Employee />
        </div>

        {/* Section 5: Job Options */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {EMPLOYEE_STEPS[4].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            {EMPLOYEE_STEPS[4].description}
          </p>
          <Step5Employee />
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
            disabled={!agreedToTerms}
            className={`px-6 py-2 text-white transition rounded-lg ${
              agreedToTerms
                ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
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

function Step1Employee() {
  return (
    <div className="space-y-4">
      {/* Tên đầy đủ */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tên đầy đủ
        </label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Nguyễn Văn A"
          />
        </div>
      </div>

      {/* Ngày sinh + Giới tính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Ngày sinh
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Giới tính
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            <select className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none">
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ảnh đại diện + Ảnh CCCD */}
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
        </div>
      </div>
    </div>
  );
}

function Step2Employee({ showPassword, setShowPassword }) {
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="username"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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

function Step3Employee() {
  return (
    <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="email@example.com"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="0123456789"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Employee() {
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Hà Nội"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Địa chỉ cụ thể
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="123 Đường ABC"
          />
        </div>
      </div>
    </div>
  );
}

function Step5Employee() {
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Loại hình công việc bạn muốn
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
          <select className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none">
            <option value="">Chọn loại hình công việc</option>
            <option>Toàn thời gian</option>
            <option>Bán thời gian</option>
            <option>Freelance</option>
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
      </div>
    </div>
  );
}

export { Step1Employee, Step2Employee, Step3Employee, Step4Employee, Step5Employee };