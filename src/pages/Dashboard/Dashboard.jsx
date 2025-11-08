import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = (user?.role || user?.roles?.[0] || 'User').replace('ROLE_', '');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard - {userRole}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email || user?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chào mừng, {user?.fullName || user?.email}!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <User className="w-8 h-8 text-blue-600 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Thông tin tài khoản</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Vai trò: <span className="font-medium">{userRole}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Email: <span className="font-medium">{user?.email}</span>
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <Settings className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">Cài đặt</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Quản lý thông tin cá nhân và cài đặt tài khoản
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="w-8 h-8 text-purple-600 mb-2 font-bold text-xl">📊</div>
                <h3 className="text-lg font-semibold text-gray-900">Thống kê</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Xem báo cáo và thống kê hoạt động
                </p>
              </div>
            </div>

            {userRole.toLowerCase() === 'admin' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">Quyền Admin</h3>
                <p className="text-xs text-yellow-700 mt-1">
                  Bạn có quyền truy cập đầy đủ vào hệ thống quản trị
                </p>
              </div>
            )}

            {userRole.toLowerCase() === 'support' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Quyền Support</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Bạn có quyền hỗ trợ và quản lý yêu cầu khách hàng
                </p>
              </div>
            )}

            {userRole.toLowerCase() === 'caregiver' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Quyền Caregiver</h3>
                <p className="text-xs text-green-700 mt-1">
                  Bạn có quyền quản lý hồ sơ và lịch làm việc của mình
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
