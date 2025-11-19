import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  AlertCircle,
  User,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supportService } from '@services';

const SupportSidebar = ({ isOpen, onClose }) => {
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [myTicketsCount, setMyTicketsCount] = useState(0);

  useEffect(() => {
    fetchTicketCounts();
  }, []);

  const fetchTicketCounts = async () => {
    try {
      // Fetch unassigned tickets count
      const unassignedResponse = await supportService.getUnassignedTickets();
      if (unassignedResponse.success) {
        setUnassignedCount(unassignedResponse.data.length);
      }

      // Fetch assigned tickets count
      const assignedResponse = await supportService.getAssignedTickets();
      if (assignedResponse.success) {
        setMyTicketsCount(assignedResponse.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch ticket counts:', error);
    }
  };

  const navItems = [
    {
      path: '/support/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/support/tickets',
      icon: Ticket,
      label: 'All Tickets',
    },
    {
      path: '/support/unassigned',
      icon: AlertCircle,
      label: 'Unassigned Tickets',
      badge: unassignedCount,
    },
    {
      path: '/support/my-tickets',
      icon: User,
      label: 'My Tickets',
      badge: myTicketsCount,
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
          <h1 className="text-xl font-bold text-primary-600">Care Support</h1>
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
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SupportSidebar;
