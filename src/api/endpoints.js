// API endpoints based on Care backend
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER_CUSTOMER: '/api/auth/register/customer',
    REGISTER_CAREGIVER: '/api/auth/register/caregiver',
    LOGOUT: '/api/auth/logout',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/api/admin/dashboard/stats',
    PENDING_CAREGIVERS: '/api/admin/caregivers/pending',
    APPROVE_CAREGIVER: (id) => `/api/admin/caregivers/${id}/approve`,
    REJECT_CAREGIVER: (id) => `/api/admin/caregivers/${id}/reject`,
    USERS: '/api/admin/users',
    LOCK_USER: (id) => `/api/admin/users/${id}/lock`,
    UNLOCK_USER: (id) => `/api/admin/users/${id}/unlock`,
  },

  // Customer
  CUSTOMER: {
    PROFILE: '/api/customers/me',
    UPDATE_PROFILE: '/api/customers/me',
    ADDRESSES: '/api/customers/addresses',
    DEFAULT_ADDRESS: '/api/customers/addresses/default',
    CREATE_ADDRESS: '/api/customers/addresses',
    SET_DEFAULT_ADDRESS: (id) => `/api/customers/addresses/${id}/default`,
    DELETE_ADDRESS: (id) => `/api/customers/addresses/${id}`,
    BOOKINGS: '/api/customer/bookings',
    CREATE_BOOKING: '/api/customer/bookings',
    CANCEL_BOOKING: (id) => `/api/customer/bookings/${id}/cancel`,
    REVIEWS: '/api/customer/reviews',
    CREATE_REVIEW: '/api/customer/reviews',
    CAREGIVERS: '/api/customer/caregivers',
    CAREGIVER_DETAIL: (id) => `/api/customer/caregivers/${id}`,
    CAREGIVER_REVIEWS: (id) => `/api/customer/caregivers/${id}/reviews`,
  },

  // Caregiver
  CAREGIVER: {
    PROFILE: '/api/caregiver/profile',
    UPDATE_PROFILE: '/api/caregiver/profile',
    BOOKINGS: '/api/caregiver/bookings',
    ACCEPT_BOOKING: (id) => `/api/caregiver/bookings/${id}/accept`,
    REJECT_BOOKING: (id) => `/api/caregiver/bookings/${id}/reject`,
    COMPLETE_BOOKING: (id) => `/api/caregiver/bookings/${id}/complete`,
    REVIEWS: '/api/caregiver/reviews',
    RESPOND_REVIEW: (id) => `/api/caregiver/reviews/${id}/respond`,
    UPDATE_AVAILABILITY: '/api/caregiver/availability',
    DASHBOARD_STATS: '/api/caregiver/dashboard/stats',
    PAYMENTS: '/api/caregiver/payments',
  },

  // Support
  SUPPORT: {
    TICKETS: '/api/support/tickets',
    TICKET_BY_ID: (id) => `/api/support/tickets/${id}`,
    UNASSIGNED_TICKETS: '/api/support/tickets/unassigned',
    ASSIGNED_TICKETS: '/api/support/tickets/assigned',
    ASSIGN_TICKET: (id) => `/api/support/tickets/${id}/assign`,
    UPDATE_TICKET: (id) => `/api/support/tickets/${id}`,
    UPDATE_STATUS: (id) => `/api/support/tickets/${id}/status`,
    RESOLVE_TICKET: (id) => `/api/support/tickets/${id}/resolve`,
    ESCALATE_TICKET: (id) => `/api/support/tickets/${id}/escalate`,
  },

  // Common
  NOTIFICATIONS: '/api/notifications',
  MARK_NOTIFICATION_READ: (id) => `/api/notifications/${id}/read`,
  SUPPORT_TICKETS: '/api/support-tickets',
  CREATE_SUPPORT_TICKET: '/api/support-tickets',
};

export default API_ENDPOINTS;
