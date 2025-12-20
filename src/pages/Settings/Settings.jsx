import React, { useState } from 'react';
import { Lock, Bell, Eye, AlertCircle } from 'lucide-react';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import AccountSettings from './AccountSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');

  const tabs = [
    {
      id: 'security',
      label: 'Bảo mật',
      icon: Lock,
      component: SecuritySettings,
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: Bell,
      component: NotificationSettings,
    },
    {
      id: 'privacy',
      label: 'Riêng tư',
      icon: Eye,
      component: PrivacySettings,
    },
    {
      id: 'account',
      label: 'Tài khoản',
      icon: AlertCircle,
      component: AccountSettings,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData.component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Cài đặt</h1>
          <p className="text-gray-600 mt-2">Quản lý các cài đặt tài khoản của bạn</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
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

export default Settings;
