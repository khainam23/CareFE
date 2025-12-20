import React, { useState } from 'react';
import { Eye, Lock, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const PrivacySettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profileVisibility: 'private',
    showPhoneNumber: false,
    showEmail: false,
    allowMessaging: true,
    allowProfileSharing: false,
    allowDataAnalytics: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Swal.fire('Thành công', 'Cài đặt riêng tư đã được lưu', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể lưu cài đặt', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Cài đặt riêng tư</h3>
          <p className="text-sm text-blue-700">Kiểm soát quyền truy cập vào thông tin của bạn</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hiển thị hồ sơ
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          >
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
            <option value="friends">Chỉ bạn bè</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Kiểm soát ai có thể xem hồ sơ của bạn</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Hiển thị số điện thoại</h4>
              <p className="text-sm text-gray-600">Cho phép chuyên viên xem số của bạn</p>
            </div>
            <button
              onClick={() => handleToggle('showPhoneNumber')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.showPhoneNumber ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.showPhoneNumber ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Hiển thị email</h4>
              <p className="text-sm text-gray-600">Cho phép chuyên viên xem email của bạn</p>
            </div>
            <button
              onClick={() => handleToggle('showEmail')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.showEmail ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.showEmail ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Cho phép nhắn tin</h4>
              <p className="text-sm text-gray-600">Cho phép chuyên viên liên hệ qua tin nhắn</p>
            </div>
            <button
              onClick={() => handleToggle('allowMessaging')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.allowMessaging ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.allowMessaging ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Cho phép chia sẻ hồ sơ</h4>
              <p className="text-sm text-gray-600">Cho phép hệ thống chia sẻ hồ sơ với chuyên viên phù hợp</p>
            </div>
            <button
              onClick={() => handleToggle('allowProfileSharing')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.allowProfileSharing ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.allowProfileSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Cho phép phân tích dữ liệu</h4>
              <p className="text-sm text-gray-600">Cho phép chúng tôi phân tích dữ liệu để cải thiện dịch vụ</p>
            </div>
            <button
              onClick={() => handleToggle('allowDataAnalytics')}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.allowDataAnalytics ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.allowDataAnalytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
      </button>
    </div>
  );
};

export default PrivacySettings;
