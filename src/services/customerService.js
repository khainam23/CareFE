import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const customerService = {
  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CUSTOMER.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách caregivers có sẵn
  getCaregivers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.CAREGIVERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy chi tiết caregiver
  getCaregiverDetail: async (caregiverId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.CAREGIVER_DETAIL(caregiverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy reviews của caregiver
  getCaregiverReviews: async (caregiverId) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.CAREGIVER_REVIEWS(caregiverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo booking
  createBooking: async (bookingData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMER.CREATE_BOOKING, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách bookings
  getBookings: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.BOOKINGS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Hủy booking
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.CUSTOMER.CANCEL_BOOKING(bookingId), {
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo review
  createReview: async (reviewData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMER.CREATE_REVIEW, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách reviews
  getReviews: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMER.REVIEWS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default customerService;