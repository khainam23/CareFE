import { Menu, User } from 'lucide-react';
import { useAuthStore } from '@store/authStore';

const SupportHeader = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header
      className="sticky top-0 z-10 bg-white h-16"
      style={{ borderBottom: "1px solid #e5e7eb" }}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Menu Button (Mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-chilled-gray-100 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Right: User Info */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-charcoal-500">
                {user?.fullName || 'Support User'}
              </p>
              <p className="text-xs text-chilled-gray-400">
                {user?.roles?.[0] || 'ROLE_SUPPORT'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-green-200">
              <User size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SupportHeader;
