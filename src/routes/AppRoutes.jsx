import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, NotFound, Login, SignUp, FindCaregiver, CaregiverDetail, About, CustomerInfo, EmployeeProfile, TermsOfService, PrivacyPolicy, PaymentReturn } from '@pages';
import MainLayout from '@components/layout/MainLayout';
import ProtectedRoute from '@components/common/ProtectedRoute';
import PublicRoute from '@components/common/PublicRoute';
import AdminLayout from '@components/admin/AdminLayout';
import AdminDashboard from '@pages/Admin/Dashboard/AdminDashboard';
import UsersList from '@pages/Admin/Users/UsersList';
import CaregiversList from '@pages/Admin/Caregivers/CaregiversList';
import BookingsList from '@pages/Admin/Bookings/BookingsList';
import ServicesList from '@pages/Admin/Services/ServicesList';
import SupportLayout from '@components/support/SupportLayout';
import SupportDashboard from '@pages/Support/Dashboard/SupportDashboard';
import TicketsList from '@pages/Support/Tickets/TicketsList';
import TicketDetail from '@pages/Support/Tickets/TicketDetail';
import UnassignedTickets from '@pages/Support/Tickets/UnassignedTickets';
import MyTicketsList from '@pages/Support/MyTickets/MyTicketsList';
import { ROUTES } from '@constants';
import ScrollToTop from '@/components/ScrollToTop';

// App Routes
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTES.LOGIN} element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path={ROUTES.REGISTER} element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        
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

        {/* Support Routes */}
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={['support', 'admin']}>
              <SupportLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SupportDashboard />} />
          <Route path="tickets" element={<TicketsList />} />
          <Route path="tickets/:id" element={<TicketDetail />} />
          <Route path="unassigned" element={<UnassignedTickets />} />
          <Route path="my-tickets" element={<MyTicketsList />} />
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

        {/* Payment Return Route */}
        <Route path="/payment-return" element={<PaymentReturn />} />

        {/* Public routes with MainLayout - Chỉ cho phép customer và user chưa đăng nhập */}
        <Route path="/" element={
          <PublicRoute>
            <MainLayout />
          </PublicRoute>
        }>
          <Route index element={<Home />} />
          <Route path={ROUTES.FIND_CAREGIVER} element={<FindCaregiver />} />
          <Route path={ROUTES.CAREGIVER_DETAIL} element={<CaregiverDetail />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.TERMS_OF_SERVICE} element={<TermsOfService />} />
          <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
          
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
