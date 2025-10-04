import React from 'react';
import { Link } from 'react-router-dom';
import CareNowLogo from '@assets/icons/CareNowLogo.svg';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={CareNowLogo} alt="CareNow" className="h-7" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/tim-kiem-bao-mau" className="text-gray-700 hover:text-teal-600 transition-colors">
              Tìm kiếm báo mẫu
            </Link>
            <Link to="/tro-thanh-chuyen-vien" className="text-gray-700 hover:text-teal-600 transition-colors">
              Trở thành chuyên viên chăm sóc
            </Link>
            <Link to="/ve-carenows" className="text-gray-700 hover:text-teal-600 transition-colors">
              Về CareNows
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-teal-600 transition-colors font-medium">
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
