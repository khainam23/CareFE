import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const adminService = {
  // ==================== Dashboard ====================
  
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== User Management ====================
  
  getAllUsers: async (page = 0, size = 20, sortBy = 'id', sortDir = 'DESC') => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.USERS, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  suspendUser: async (userId) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/suspend`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  activateUser: async (userId) => {
    try {
      const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== Caregiver Management ====================
  
  getAllCaregivers: async (page = 0, size = 20, sortBy = 'id', sortDir = 'DESC') => {
    try {
      const response = await axiosInstance.get('/api/admin/caregivers', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCaregiverById: async (caregiverId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/caregivers/${caregiverId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCaregiver: async (caregiverData) => {
    try {
      const response = await axiosInstance.post('/api/admin/caregivers', caregiverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCaregiver: async (caregiverId, caregiverData) => {
    try {
      const response = await axiosInstance.put(`/api/admin/caregivers/${caregiverId}`, caregiverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCaregiver: async (caregiverId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/caregivers/${caregiverId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPendingCaregivers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PENDING_CAREGIVERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  approveCaregiver: async (caregiverId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.APPROVE_CAREGIVER(caregiverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  rejectCaregiver: async (caregiverId, reason) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.REJECT_CAREGIVER(caregiverId), {
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== Booking Management ====================
  
  getAllBookings: async (page = 0, size = 20, sortBy = 'id', sortDir = 'DESC') => {
    try {
      const response = await axiosInstance.get('/api/admin/bookings', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await axiosInstance.post('/api/admin/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await axiosInstance.put(`/api/admin/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await axiosInstance.put(`/api/admin/bookings/${bookingId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteBooking: async (bookingId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== Service Management ====================
  
  getAllServices: async (page = 0, size = 20, sortBy = 'id', sortDir = 'DESC') => {
    try {
      const response = await axiosInstance.get('/api/admin/services', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getServiceById: async (serviceId) => {
    try {
      const response = await axiosInstance.get(`/api/admin/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await axiosInstance.post('/api/admin/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateService: async (serviceId, serviceData) => {
    try {
      const response = await axiosInstance.put(`/api/admin/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  toggleServiceStatus: async (serviceId) => {
    try {
      const response = await axiosInstance.put(`/api/admin/services/${serviceId}/toggle`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== Legacy Methods (for backward compatibility) ====================
  
  getUsers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  lockUser: async (userId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.LOCK_USER(userId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  unlockUser: async (userId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.UNLOCK_USER(userId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default adminService;