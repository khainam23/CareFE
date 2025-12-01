import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Star,
  X,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import CareNowLogo from '@assets/images/Logo.svg';

const SupportSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      path: '/support/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/support/bookings',
      icon: Calendar,
      label: 'Quản lý Booking',
    },
    {
      path: '/support/customers',
      icon: Users,
      label: 'Quản lý Customers',
    },
    {
      path: '/support/caregivers',
      icon: UserCheck,
      label: 'Quản lý Caregivers',
    },
    {
      path: '/support/reviews',
      icon: Star,
      label: 'Quản lý Đánh giá',
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-green-400 border-r border-green-200 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 mb-2 mt-5">
          <img src={CareNowLogo} alt="CareNow" className="h-12" />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-chilled-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-500 font-medium'
                      : 'text-chilled-gray-500 hover:bg-green-50'
                  }`
                }
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button - Outside nav, at bottom */}
        <div className="p-4 border-t border-green-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-50 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SupportSidebar;
