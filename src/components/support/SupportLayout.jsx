import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SupportSidebar from './SupportSidebar';
import SupportHeader from './SupportHeader';

const SupportLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-chilled-gray-50">
      {/* Sidebar */}
      <SupportSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <SupportHeader onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default SupportLayout;
