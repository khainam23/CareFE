import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, NotFound, Login, SignUp, FindCaregiver, CaregiverDetail, About, CustomerInfo, EmployeeProfile } from '@pages';
import MainLayout from '@components/layout/MainLayout';
import ProtectedRoute from '@components/common/ProtectedRoute';
import AdminLayout from '@components/admin/AdminLayout';
import AdminDashboard from '@pages/Admin/Dashboard/AdminDashboard';
import UsersList from '@pages/Admin/Users/UsersList';
import CaregiversList from '@pages/Admin/Caregivers/CaregiversList';
import BookingsList from '@pages/Admin/Bookings/BookingsList';
import ServicesList from '@pages/Admin/Services/ServicesList';
import { ROUTES } from '@constants';

// App Routes
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<SignUp />} />
        
        {/* Admin Routes */}
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
        
        {/* Protected Dashboard Route - Admin, Support & Caregiver */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute allowedRoles={['admin', 'support', 'caregiver']}>
              <EmployeeProfile />
            </ProtectedRoute>
          } 
        />

        {/* Protected Employee Profile - Caregiver only */}
        <Route 
          path={ROUTES.EMPLOYEE_PROFILE} 
          element={
            <ProtectedRoute allowedRoles={['caregiver']}>
              <EmployeeProfile />
            </ProtectedRoute>
          } 
        />

        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.FIND_CAREGIVER} element={<FindCaregiver />} />
          <Route path={ROUTES.CAREGIVER_DETAIL} element={<CaregiverDetail />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          
          {/* Protected Customer Info - Customer only */}
          <Route 
            path={ROUTES.CUSTOMER_INFO} 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerInfo />
              </ProtectedRoute>
            } 
          />
          
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
