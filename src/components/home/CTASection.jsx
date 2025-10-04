import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="bg-[#00A787] py-20 text-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider mb-2">Let's talk</p>
          <h2 className="text-4xl font-bold">
            Liên hệ ngay, và cùng <br /> chăm sóc tận tâm.
          </h2>
        </div>
        <Link
          to="/register"
          className="mt-6 md:mt-0 inline-block bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
        >
          <span>Đăng ký ngay</span>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
