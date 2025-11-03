import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const adminService = {
  // Lấy thống kê dashboard
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách caregivers chờ duyệt
  getPendingCaregivers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PENDING_CAREGIVERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Phê duyệt caregiver
  approveCaregiver: async (caregiverId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.APPROVE_CAREGIVER(caregiverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Từ chối caregiver
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

  // Lấy danh sách users
  getUsers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Khóa user
  lockUser: async (userId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.LOCK_USER(userId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mở khóa user
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