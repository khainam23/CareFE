import React, { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingUpdates: true,
    caregiverMessages: true,
    systemAnnouncements: true,
    weeklyReport: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Swal.fire('Thành công', 'Cài đặt thông báo đã được lưu', 'success');
    } catch (error) {
      Swal.fire('Lỗi', 'Không thể lưu cài đặt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const notificationOptions = [
    {
      key: 'emailNotifications',
      label: 'Thông báo email',
      description: 'Nhận thông báo qua email'
    },
    {
      key: 'smsNotifications',
      label: 'Thông báo SMS',
      description: 'Nhận thông báo qua tin nhắn'
    },
    {
      key: 'pushNotifications',
      label: 'Thông báo push',
      description: 'Nhận thông báo trên trình duyệt'
    },
    {
      key: 'bookingUpdates',
      label: 'Cập nhật đặt lịch',
      description: 'Thông báo về thay đổi lịch chăm sóc'
    },
    {
      key: 'caregiverMessages',
      label: 'Tin nhắn từ chuyên viên',
      description: 'Thông báo khi nhân viên chăm sóc gửi tin nhắn'
    },
    {
      key: 'systemAnnouncements',
      label: 'Thông báo hệ thống',
      description: 'Thông báo quan trọng từ LifeEase'
    },
    {
      key: 'weeklyReport',
      label: 'Báo cáo hàng tuần',
      description: 'Nhận báo cáo tóm tắt hàng tuần'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Quản lý thông báo</h3>
          <p className="text-sm text-blue-700">Chọn loại thông báo bạn muốn nhận</p>
        </div>
      </div>

      <div className="space-y-3">
        {notificationOptions.map(option => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div>
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
            <button
              onClick={() => handleToggle(option.key)}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings[option.key] ? 'bg-teal-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings[option.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
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

export default NotificationSettings;
