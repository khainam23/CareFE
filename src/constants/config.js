// App configuration
export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CareFE',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  VERSION: '1.0.0',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  SUPPORT: 'ROLE_SUPPORT',
  CUSTOMER: 'ROLE_CUSTOMER',
  CAREGIVER: 'ROLE_CAREGIVER'
};

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

// Support ticket status
export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  ESCALATED: 'ESCALATED'
};

// Support ticket categories
export const TICKET_CATEGORIES = {
  TECHNICAL: 'TECHNICAL',
  ACCOUNT: 'ACCOUNT',
  BOOKING: 'BOOKING',
  PAYMENT: 'PAYMENT',
  VERIFICATION: 'VERIFICATION',
  COMPLAINT: 'COMPLAINT',
  FEEDBACK: 'FEEDBACK'
};

// Support ticket priorities
export const TICKET_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export default APP_CONFIG;
