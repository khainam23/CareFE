import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const caregiverService = {
  // Lấy thống kê dashboard
  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CAREGIVER.DASHBOARD_STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CAREGIVER.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CAREGIVER.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật trạng thái sẵn sàng
  updateAvailability: async (isAvailable) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CAREGIVER.UPDATE_AVAILABILITY, {
        available: isAvailable
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách bookings
  getBookings: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CAREGIVER.BOOKINGS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Chấp nhận booking
  acceptBooking: async (bookingId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CAREGIVER.ACCEPT_BOOKING(bookingId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Từ chối booking
  rejectBooking: async (bookingId, reason) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CAREGIVER.REJECT_BOOKING(bookingId), {
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Hoàn thành booking
  completeBooking: async (bookingId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CAREGIVER.COMPLETE_BOOKING(bookingId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách reviews
  getReviews: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CAREGIVER.REVIEWS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Trả lời review
  respondToReview: async (reviewId, response) => {
    try {
      const result = await axiosInstance.put(API_ENDPOINTS.CAREGIVER.RESPOND_REVIEW(reviewId), {
        response
      });
      return result.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy lịch sử thanh toán
  getPayments: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CAREGIVER.PAYMENTS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default caregiverService;