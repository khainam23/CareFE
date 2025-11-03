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
    BOOKINGS: '/api/customers/bookings',
    CREATE_BOOKING: '/api/bookings',
    CANCEL_BOOKING: (id) => `/api/customers/bookings/${id}/cancel`,
    REVIEWS: '/api/customers/reviews',
    CREATE_REVIEW: '/api/reviews',
    SEARCH_CAREGIVERS: '/api/caregivers/search',
  },

  // Caregiver
  CAREGIVER: {
    PROFILE: '/api/caregivers/me',
    UPDATE_PROFILE: '/api/caregivers/me',
    BOOKINGS: '/api/caregiver/bookings',
    ACCEPT_BOOKING: (id) => `/api/caregiver/bookings/${id}/accept`,
    REJECT_BOOKING: (id) => `/api/caregiver/bookings/${id}/reject`,
    COMPLETE_BOOKING: (id) => `/api/caregiver/bookings/${id}/complete`,
    REVIEWS: '/api/caregiver/reviews',
    RESPOND_REVIEW: (id) => `/api/caregiver/reviews/${id}/respond`,
    UPDATE_AVAILABILITY: '/api/caregiver/availability',
  },

  // Support
  SUPPORT: {
    TICKETS: '/api/support/tickets',
    UNASSIGNED_TICKETS: '/api/support/tickets/unassigned',
    ASSIGN_TICKET: (id) => `/api/support/tickets/${id}/assign`,
    UPDATE_TICKET: (id) => `/api/support/tickets/${id}`,
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
