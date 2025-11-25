import React from 'react';
import { Link } from 'react-router-dom';
import CareNowLogo from '@assets/images/Logo.svg';
import { Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1D3C34] ">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Newsletter */}
          <div className="lg:col-span-2">
            <img src={CareNowLogo} alt="CareNow" className="h-20 mb-6" />
            <p className="text-lg mb-4">Đăng ký để nhận những thông tin mới</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Nhập địa chỉ Email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="bg-white text-[#1D3C34] px-4 py-3 rounded-r-lg hover:bg-gray-200 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Service</h3>
            <ul className="space-y-3 text-gray-300">
              <li><Link to="/about" className="hover: transition-colors">About us</Link></li>
              <li><Link to="/contact" className="hover: transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact us</h3>
            <address className="not-italic space-y-3 text-gray-300">
              <p>NannynowComp@gmail.com</p>
              <p>+84992229928</p>
              <p>150 Tôn Đức Thắng, Hòa Minh, Liên Chiểu</p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
