import { Route } from 'react-router-dom';
import ProtectedRoute from '@components/common/ProtectedRoute';
import AdminLayout from '@components/admin/AdminLayout';
import AdminDashboard from '@pages/Admin/Dashboard/AdminDashboard';
import UsersList from '@pages/Admin/Users/UsersList';
import CaregiversList from '@pages/Admin/Caregivers/CaregiversList';
import BookingsList from '@pages/Admin/Bookings/BookingsList';
import ServicesList from '@pages/Admin/Services/ServicesList';

const AdminRoutes = () => {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UsersList />} />
      <Route path="caregivers" element={<CaregiversList />} />
      <Route path="bookings" element={<BookingsList />} />
      <Route path="services" element={<ServicesList />} />
    </Route>
  );
};

export default AdminRoutes;
