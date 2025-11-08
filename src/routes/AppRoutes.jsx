import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, NotFound, Login, SignUp, FindCaregiver, About, CustomerInfo, EmployeeProfile } from '@pages';
import MainLayout from '@components/layout/MainLayout';
import ProtectedRoute from '@components/common/ProtectedRoute';
import Dashboard from '../pages/Dashboard/Dashboard';
import { ROUTES } from '@constants';

// App Routes
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<SignUp />} />
        
        {/* Protected Dashboard Route - Admin, Support & Caregiver */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute allowedRoles={['admin', 'support', 'caregiver']}>
              <Dashboard />
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
