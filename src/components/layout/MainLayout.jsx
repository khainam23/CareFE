import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import GlobalChat from '../chat/GlobalChat';

// Main Layout Component
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <GlobalChat />
    </div>
  );
};

export default MainLayout;
