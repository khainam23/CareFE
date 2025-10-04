import React, { useState } from 'react';
import { Users } from 'lucide-react';

const RoleSelection = ({ nextStep, updateFormData }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleSelect = (role) => {
    setSelectedRole(role);
    updateFormData({ role });
    // Delay navigation to show selection
    setTimeout(() => {
      nextStep();
    }, 300);
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">
        Tham gia với tư cách khách hàng <br /> hoặc chuyên viên chăm sóc
      </h1>
      <div className="flex justify-center gap-8 mb-12">
        {/* Customer Card */}
        <div
          onClick={() => handleSelect('customer')}
          className={`relative w-80 h-48 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
            selectedRole === 'customer' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="absolute top-6 left-6">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <div
            className={`absolute top-6 right-6 w-6 h-6 border-2 rounded-full transition-all duration-300 ${
              selectedRole === 'customer' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
            }`}
          >
            {selectedRole === 'customer' && <div className="w-full h-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
          </div>
          <p className="absolute bottom-6 left-6 text-left text-lg font-medium text-gray-700">
            Tôi là khách hàng, cần thuê chuyên viên chăm sóc
          </p>
        </div>

        {/* Professional Card */}
        <div
          onClick={() => handleSelect('professional')}
          className={`relative w-80 h-48 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
            selectedRole === 'professional' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="absolute top-6 left-6">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <div
            className={`absolute top-6 right-6 w-6 h-6 border-2 rounded-full transition-all duration-300 ${
              selectedRole === 'professional' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
            }`}
          >
             {selectedRole === 'professional' && <div className="w-full h-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
          </div>
          <p className="absolute bottom-6 left-6 text-left text-lg font-medium text-gray-700">
            Tôi muốn trở thành chuyên viên chăm sóc của CareNow
          </p>
        </div>
      </div>
      <button
        onClick={() => window.history.back()}
        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        Quay lại
      </button>
    </div>
  );
};

export default RoleSelection;
