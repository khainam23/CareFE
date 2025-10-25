import { Link } from 'react-router-dom';
import CareNowLogo from '@assets/images/Logo.svg';
import {ROUTES} from '@constants';

const Header = () => {
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
