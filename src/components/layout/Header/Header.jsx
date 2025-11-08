import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import CareNowLogo from '@assets/images/Logo.svg';
import { ROUTES } from '@constants';
import { useAuthStore } from '../../../store/authStore';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const getUserDisplayName = () => {
    return user?.fullName || user?.email?.split('@')[0] || 'User';
  };

  const getUserRole = () => {
    const role = user?.role || user?.roles?.[0] || '';
    const roleMap = {
      admin: 'Quản trị viên',
      support: 'Hỗ trợ',
      customer: 'Khách hàng',
      caregiver: 'Chuyên viên'
    };
    return roleMap[role.toLowerCase()] || role;
  };

  const getDashboardLink = () => {
    const role = user?.role || user?.roles?.[0];
    const roleNormalized = role?.replace('ROLE_', '').toLowerCase();
    switch (roleNormalized) {
      case 'admin':
      case 'support':
      case 'caregiver':
        return '/dashboard';
      case 'customer':
        return '/customer-info';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container px-6 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={CareNowLogo} alt="CareNow" className="h-20" />
          </Link>

          <nav className="items-center hidden space-x-8 md:flex">
            <Link to={ROUTES.HOME} className="text-gray-700 transition-colors hover:text-teal-600">
              Trang chủ
            </Link>
            <Link to={ROUTES.FIND_CAREGIVER} className="text-gray-700 transition-colors hover:text-teal-600">
              Tìm người chăm sóc
            </Link>
            <Link to={ROUTES.ABOUT} className="text-gray-700 transition-colors hover:text-teal-600">
              Về LifeEase
            </Link>
          </nav>

          <div className="items-center hidden space-x-4 md:flex">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{getUserRole()}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500">{getUserRole()}</p>
                    </div>

                    <div className="py-2">
                      {(() => {
                        const role = user?.role || user?.roles?.[0];
                        const roleNormalized = role?.replace('ROLE_', '').toLowerCase();
                        
                        if (roleNormalized === 'customer') {
                          return (
                            <Link
                              to="/customer-info"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>Thông tin cá nhân</span>
                            </Link>
                          );
                        } else if (roleNormalized === 'admin' || roleNormalized === 'caregiver' || roleNormalized === 'support') {
                          return (
                            <Link
                              to="/dashboard"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                          );
                        }
                        return null;
                      })()}
                      <Link
                        to="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Cài đặt</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-white rounded-lg font-medium bg-[#00A787] hover:bg-opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <span>Đăng ký ngay</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
