// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  FIND_CAREGIVER: '/tim-kiem-chuyen-vien',
  CAREGIVER_DETAIL: '/caregivers/:id',
  ABOUT: '/ve-lifeease',
  PROFILE: '/profile',
  CUSTOMER_INFO: '/customer-info',
  EMPLOYEE_PROFILE: '/employee-profile',
  SETTINGS: '/settings',
  TERMS_OF_SERVICE: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',
  NOT_FOUND: '*',
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CAREGIVERS: '/admin/caregivers',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SERVICES: '/admin/services',
  // Support routes
  SUPPORT_DASHBOARD: '/support/dashboard',
  SUPPORT_TICKETS: '/support/tickets',
  SUPPORT_TICKET_DETAIL: '/support/tickets/:id',
  SUPPORT_UNASSIGNED: '/support/unassigned',
  SUPPORT_MY_TICKETS: '/support/my-tickets',
};

export default ROUTES;
