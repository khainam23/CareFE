import { useState, useEffect } from 'react';
import { Upload, Eye, EyeOff, Edit2, Save, X, AlertCircle, Lock, Bell, Globe } from 'lucide-react';
import { caregiverService } from '@/services/caregiverService';
import DatePickerInput from '@/components/DatePickerInput';

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    taskReminders: true,
    paymentAlerts: true,
  });

  // User data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    idNumber: '',
    address: '',
    city: '',
    specialization: '',
    certifications: '',
    experienceYears: '',
    language: 'vi',
  });

  const [formData, setFormData] = useState(profileData);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await caregiverService.getProfile();
      if (response.success && response.data) {
        const data = response.data;
        const mappedData = {
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          idNumber: data.idCardNumber || '',
          address: data.address || '',
          city: data.city || '',
          specialization: data.bio || '',
          certifications: data.skills || '',
          experienceYears: data.experience || '',
          language: 'vi',
        };
        setProfileData(mappedData);
        setFormData(mappedData);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (value) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: value
    }));
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        bio: formData.specialization,
        skills: formData.certifications,
        experience: formData.experienceYears,
        idCardNumber: formData.idNumber,
        availableSchedule: formData.availableSchedule || '',
        hourlyRate: formData.hourlyRate || null,
      };
      
      const response = await caregiverService.updateProfile(updateData);
      if (response.success) {
        setProfileData(formData);
        setIsEditing(false);
        alert('Cập nhật thành công!');
        fetchProfile(); // Refresh data from server
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.message || 'Không thể cập nhật profile');
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-teal-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const FormInput = ({ label, name, value, type = 'text', disabled = false, placeholder = '' }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {type === 'date' ? (
        <DatePickerInput
          value={value}
          onChange={handleDateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={disabled || !isEditing}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          disabled={disabled || !isEditing}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cài đặt hồ sơ</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-teal-500  py-2 px-4 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            <Edit2 size={18} />
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ảnh hồ sơ</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-3xl">👤</span>
          </div>
          {isEditing && (
            <button className="flex items-center gap-2 bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
              <Upload size={18} />
              Thay đổi ảnh
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label="Họ và tên" name="fullName" value={formData.fullName} />
          <FormInput label="Email" name="email" value={formData.email} type="email" disabled />
          <FormInput label="Ngày sinh" name="dateOfBirth" value={formData.dateOfBirth} type="date" />
          <FormInput label="Giới tính" name="gender" value={formData.gender} />
          <FormInput label="Số CCCD/Hộ chiếu" name="idNumber" value={formData.idNumber} />
          <FormInput label="Số điện thoại" name="phone" value={formData.phone} type="tel" />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormInput label="Địa chỉ" name="address" value={formData.address} />
          </div>
          <FormInput label="Thành phố/Tỉnh" name="city" value={formData.city} />
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chuyên môn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormInput label="Chuyên môn" name="specialization" value={formData.specialization} />
          </div>
          <FormInput label="Chứng chỉ/Bằng cấp" name="certifications" value={formData.certifications} />
          <FormInput label="Năm kinh nghiệm" name="experienceYears" value={formData.experienceYears} type="number" />
        </div>
      </div>

      {/* Security - Change Password */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={20} className="text-teal-600" />
          Bảo mật
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="w-full bg-teal-500  py-2 px-4 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
            Cập nhật mật khẩu
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-teal-600" />
          Thông báo
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Thông báo qua email</p>
              <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
            </div>
            <ToggleSwitch
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Thông báo SMS</p>
              <p className="text-sm text-gray-600">Nhận thông báo qua tin nhắn SMS</p>
            </div>
            <ToggleSwitch
              checked={notifications.smsNotifications}
              onChange={() => handleNotificationChange('smsNotifications')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Nhắc nhở về nhiệm vụ</p>
              <p className="text-sm text-gray-600">Nhắc nhở trước khi có nhiệm vụ mới</p>
            </div>
            <ToggleSwitch
              checked={notifications.taskReminders}
              onChange={() => handleNotificationChange('taskReminders')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Cảnh báo thanh toán</p>
              <p className="text-sm text-gray-600">Cảnh báo khi có thanh toán mới</p>
            </div>
            <ToggleSwitch
              checked={notifications.paymentAlerts}
              onChange={() => handleNotificationChange('paymentAlerts')}
            />
          </div>
        </div>
      </div>

      {/* Language & Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={20} className="text-teal-600" />
          Tùy chọn
        </h3>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ngôn ngữ</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          Khu vực nguy hiểm
        </h3>
        <p className="text-sm text-gray-600 mb-4">Những hành động dưới đây không thể hoàn tác. Vui lòng cẩn thận.</p>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-2 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-teal-500  py-2 px-6 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;