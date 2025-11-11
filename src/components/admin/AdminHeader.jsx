import { Menu, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

const AdminHeader = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-chilled-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Menu Button (Mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-chilled-gray-100"
        >
          <Menu size={24} />
        </button>

        {/* Right: User Info & Logout */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-charcoal-900">
                {user?.fullName || 'Admin User'}
              </p>
              <p className="text-xs text-chilled-gray-600">
                {user?.roles?.[0] || 'ROLE_ADMIN'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
