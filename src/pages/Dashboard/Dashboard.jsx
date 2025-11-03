import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { USER_ROLES } from '../../constants/config';
import { Bell, User, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout, hasRole } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch notifications when component mounts
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      window.location.href = '/login';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Chưa đăng nhập</h2>
          <p className="mt-2 text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Chào mừng, {user.fullName}!
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.roles?.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Role-specific content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasRole(USER_ROLES.ADMIN) && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Quản trị viên
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quản lý hệ thống, duyệt caregiver, xem báo cáo
                  </p>
                  <div className="mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                      Vào trang Admin
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hasRole(USER_ROLES.CUSTOMER) && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Khách hàng
                  </h3>
                  <p className="text-sm text-gray-600">
                    Đặt dịch vụ chăm sóc, quản lý booking, đánh giá
                  </p>
                  <div className="mt-4">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700">
                      Đặt dịch vụ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hasRole(USER_ROLES.CAREGIVER) && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chuyên viên chăm sóc
                  </h3>
                  <p className="text-sm text-gray-600">
                    Nhận việc, quản lý lịch làm việc, xem đánh giá
                  </p>
                  <div className="mt-4">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
                      Xem công việc
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hasRole(USER_ROLES.SUPPORT) && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Hỗ trợ khách hàng
                  </h3>
                  <p className="text-sm text-gray-600">
                    Xử lý tickets, hỗ trợ người dùng
                  </p>
                  <div className="mt-4">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-700">
                      Xem tickets
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent notifications */}
          {notifications && notifications.length > 0 && (
            <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thông báo gần đây
                </h3>
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}