import React from 'react';
import GoogleIcon from '@assets/icons/GoogleIcon.svg';
import heroBanner from '@assets/images/hero-banner.png';

const Login = () => {
  return (
    <div className="flex h-screen font-sans">
      {/* Left side - Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-12">
        <div className="w-full max-w-sm">
          
          <button className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-3 bg-white rounded-full p-0.5" />
            Đăng nhập bằng google
          </button>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-xs">hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form>
            <div className="mb-8">
              <input
                type="text"
                id="username"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Tên đăng nhập"
              />
            </div>
            <div className="mb-10">
              <input
                type="password"
                id="password"
                className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-teal-500 text-sm"
                placeholder="Mật khẩu"
              />
            </div>
            <button
              type="submit"
              style={{ backgroundColor: '#00A787' }}
              className="w-full text-white py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Hero Banner */}
      <div className="w-1/2 relative overflow-hidden">
        <img 
          src={heroBanner} 
          alt="CareNow Hero Banner" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
