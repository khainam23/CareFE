import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user?.role || user?.roles?.[0];
    const hasPermission = allowedRoles.some(
      role => role.toLowerCase() === userRole?.toLowerCase()
    );

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
