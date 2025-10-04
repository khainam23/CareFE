import { Outlet } from 'react-router-dom';

// Main Layout Component
const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
