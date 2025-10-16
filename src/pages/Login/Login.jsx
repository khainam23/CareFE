import React from 'react';
import GoogleIcon from '@assets/icons/GoogleIcon.svg';
import bgImage from '@assets/images/image 15.svg';
import cardImage from '@assets/images/Rectangle 105.svg';
import Logo from '@assets/images/Logo.svg';
import qoute from '@assets/images/qOUTE.svg';

const Login = () => {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-6 font-sans"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* subtle overlay for readability */}
      <div className="absolute inset-0 bg-white/10"></div>

      {/* Decorative area with logo and tilted cards */}
      <div className="absolute left-6 top-6 flex items-center gap-3 select-none">
        <img src={Logo} alt="CareNow Logo" className="h-16 w-auto drop-shadow" />
      </div>

      <div className="absolute left-20 bottom-16 w-64 md:w-72 rotate-[-10deg] drop-shadow-2xl">
        <img
          src={cardImage}
          alt="Info card"
        />

        <img src={qoute} alt="Qute" className='absolute z-10 bottom-2 left-10 w-60' />
      </div>

      <div className="absolute left-90 bottom-18 w-50 h-50 rotate-[20deg] drop-shadow-2xl rounded-2xl bg-[#8BAA9D]">
        <div className='bg-[#D1DAD9] h-1/2 m-2 flex items-center justify-center rounded-tl-2xl rounded-tr-2xl'>
          <span className='text-md text-center p-5'>Theo dõi sức khỏe, hỗ trợ điều dưỡng</span>
        </div>
      </div>

      {/* Right side form card */}
      <div className="relative w-full flex justify-end">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 mr-2 md:mr-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Đăng Nhập</h2>

          <button className="w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-3 bg-white rounded-full p-0.5" />
            Đăng nhập bằng Google
          </button>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-xs">hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form>
            <div className="mb-4">
              <div className="w-full flex items-center bg-white rounded-lg shadow-sm border border-gray-200 px-3 h-12">
                {/* user icon */}
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input
                  type="text"
                  id="username"
                  className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                  placeholder="Tên đăng nhập"
                />
              </div>
            </div>
            <div className="mb-2">
              <div className="w-full flex items-center bg-white rounded-lg shadow-sm border border-gray-200 px-3 h-12">
                {/* lock icon */}
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm2-10V7a4 4 0 118 0v4" /></svg>
                <input
                  type="password"
                  id="password"
                  className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                  placeholder="Mật khẩu"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 mb-6">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="accent-teal-600" />
                Nhớ mật khẩu
              </label>
              <a href="#" className="text-teal-600 hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: '#00A787' }}
              className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Chưa có tài khoản?{' '}
            <a href="#" className="text-teal-600 font-medium hover:underline">Đăng ký</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
