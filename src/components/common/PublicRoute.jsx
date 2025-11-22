import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * PublicRoute - Chỉ cho phép customer và user chưa đăng nhập truy cập
 * Chặn admin, support, caregiver truy cập các trang public
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const userRole = (user?.role || user?.roles?.[0] || '').replace('ROLE_', '').toLowerCase();
    
    // Nếu là admin, support hoặc caregiver, redirect về dashboard của họ
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    
    if (userRole === 'support') {
      return <Navigate to="/support/dashboard" replace />;
    }
    
    if (userRole === 'caregiver') {
      return <Navigate to="/employee-profile" replace />;
    }
    
    // Nếu là customer, cho phép truy cập
    if (userRole === 'customer') {
      return children;
    }
  }

  // Nếu chưa đăng nhập, cho phép truy cập
  return children;
}

