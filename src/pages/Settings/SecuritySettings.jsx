import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const SecuritySettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = () => {
    if (!formData.currentPassword) {
      Swal.fire('Lỗi', 'Vui lòng nhập mật khẩu hiện tại', 'error');
      return false;
    }
    if (!formData.newPassword) {
      Swal.fire('Lỗi', 'Vui lòng nhập mật khẩu mới', 'error');
      return false;
    }
    if (formData.newPassword.length < 6) {
      Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp', 'error');
      return false;
    }
    return true;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Swal.fire('Thành công', 'Mật khẩu đã được thay đổi', 'success');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      Swal.fire('Lỗi', error.message || 'Không thể thay đổi mật khẩu', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Bảo mật tài khoản</h3>
          <p className="text-sm text-blue-700">Thay đổi mật khẩu của bạn để bảo vệ tài khoản</p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="Nhập mật khẩu hiện tại"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="Nhập mật khẩu mới"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
              placeholder="Xác nhận mật khẩu"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default SecuritySettings;
