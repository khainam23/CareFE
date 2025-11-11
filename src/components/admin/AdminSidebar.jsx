import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  Briefcase,
  X,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Users',
    },
    {
      path: '/admin/caregivers',
      icon: Heart,
      label: 'Caregivers',
    },
    {
      path: '/admin/bookings',
      icon: Calendar,
      label: 'Bookings',
    },
    {
      path: '/admin/services',
      icon: Briefcase,
      label: 'Services',
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-chilled-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-chilled-gray-200">
          <h1 className="text-xl font-bold text-primary-600">Care Admin</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-chilled-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
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
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-chilled-gray-700 hover:bg-chilled-gray-50'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
