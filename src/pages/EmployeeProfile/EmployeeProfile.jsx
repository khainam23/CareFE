import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  CreditCard,
  Settings,
} from 'lucide-react';
import Dashboard from './tabs/Dashboard';
import Schedule from './tabs/Schedule';
import Tasks from './tabs/Tasks';
import PaymentHistory from './tabs/PaymentHistory';
import ProfileSettings from './tabs/ProfileSettings';

const EmployeeProfile = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Lịch làm việc', icon: Calendar },
    { id: 'tasks', label: 'Nhiệm vụ chăm sóc', icon: CheckSquare },
    { id: 'payment', label: 'Lịch sử thanh toán', icon: CreditCard },
    { id: 'settings', label: 'Cài đặt hồ sơ', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return <Schedule />;
      case 'tasks':
        return <Tasks />;
      case 'payment':
        return <PaymentHistory />;
      case 'settings':
        return <ProfileSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ nhân viên</h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EmployeeProfile;