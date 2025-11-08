import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import './styles/index.css';

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    // Khởi tạo auth state từ localStorage khi app load
    initAuth();
  }, [initAuth]);

  return <AppRoutes />;
}

export default App;
