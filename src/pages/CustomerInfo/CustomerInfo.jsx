import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
import PersonalProfile from './PersonalProfile';
import ScheduledCare from './ScheduledCare';

const CustomerInfo = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Đọc query parameter để tự động chuyển tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'schedule') {
      setActiveTab('schedule');
    }
  }, [searchParams]);

  const tabs = [
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: User,
      component: PersonalProfile,
    },
    {
      id: 'schedule',
      label: 'Lịch chăm sóc đã đặt',
      icon: Calendar,
      component: ScheduledCare,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData.component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Thông tin khách hàng</h1>
          <p className="text-gray-600 mt-2">Quản lý hồ sơ và lịch chăm sóc của bạn</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-teal-600 border-teal-600 bg-teal-50'
                      : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;