import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  console.log('ProtectedRoute check:', { 
    isAuthenticated, 
    user: user?.email, 
    roles: user?.roles,
    token: localStorage.getItem('token') ? 'exists' : 'missing',
    userInStorage: localStorage.getItem('user') ? 'exists' : 'missing'
  });

  // Kiểm tra authentication
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    console.log('State:', { isAuthenticated, hasUser: !!user });
    console.log('LocalStorage token:', localStorage.getItem('token'));
    console.log('LocalStorage user:', localStorage.getItem('user'));
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles.length > 0) {
    const userRole = (user?.role || user?.roles?.[0] || '').replace('ROLE_', '').toLowerCase();
    console.log('ProtectedRoute: Checking role', userRole, 'against', allowedRoles);
    
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole.toLowerCase()
    );

    if (!hasPermission) {
      console.log('ProtectedRoute: No permission, redirecting based on role');
      // Redirect về trang phù hợp với role của user
      switch (userRole) {
        case 'admin':
          return <Navigate to="/admin/dashboard" replace />;
        case 'support':
          return <Navigate to="/support/dashboard" replace />;
        case 'caregiver':
          return <Navigate to="/employee-profile" replace />;
        case 'customer':
          return <Navigate to="/" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
  }

  console.log('ProtectedRoute: Access granted');
  return children;
}
