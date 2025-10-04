import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';
import { serviceTabs } from '@constants/home';
import woman from '@assets/images/woman.png';
import oldWoman from '@assets/images/old-woman.png';
import doctor from '@assets/images/doctor.png';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState(serviceTabs[0].name);

  return (
    <section className="relative bg-[#2A6049] text-white pt-12 pb-24">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-normal mb-4 leading-tight">
            Biến sự quan tâm <br />
            <span className="font-serif italic">thành sự chăm sóc</span>
          </h1>
          <p className="text-xl mb-10 text-gray-200">
            Tìm bảo mẫu tin cậy, an tâm từng khoảnh khắc!
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              {serviceTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.name
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <select className="w-full bg-transparent border-none outline-none text-gray-700">
                    <option>Quận</option>
                    <option>Quận 1</option>
                    <option>Quận 2</option>
                    <option>Quận 3</option>
                  </select>
                </div>

                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="21:00, 02/03/2025 - 20:00, 03/03/2025"
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  />
                </div>
                
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-3">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Tên bảo mẫu"
                    className="w-full bg-transparent border-none outline-none text-gray-700"
                  />
                   <button
                    className="ml-auto bg-[#00A787] text-white p-2 rounded-full hover:bg-opacity-90 transition-opacity"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Images */}
      <img src={woman} alt="Carer 1" className="absolute top-20 left-16 w-24 h-24 rounded-full object-cover shadow-lg" />
      <img src={oldWoman} alt="Carer 2" className="absolute bottom-1/4 left-1/4 w-16 h-16 rounded-full object-cover shadow-lg" />
      <img src={doctor} alt="Carer 3" className="absolute top-1/2 right-48 w-20 h-20 rounded-full object-cover shadow-lg" />
      <img src={woman} alt="Carer 4" className="absolute bottom-10 right-1/4 w-28 h-28 rounded-full object-cover shadow-lg" />
    </section>
  );
};

export default HeroSection;
