import publicAxiosInstance from '../api/publicAxiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const publicService = {
  // Lấy danh sách caregivers (public - không cần đăng nhập)
  getCaregivers: async () => {
    const endpoints = [
      '/api/public/caregivers',
      '/api/caregivers',
      API_ENDPOINTS.CUSTOMER.CAREGIVERS,
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await publicAxiosInstance.get(endpoint);
        console.log(`Success with endpoint: ${endpoint}`, response.data);
        return response.data;
      } catch (error) {
        console.log(`Failed with endpoint: ${endpoint}`, error);
        lastError = error;
      }
    }

    // If all endpoints fail, throw the last error
    throw lastError?.response?.data || lastError?.message || 'Không thể kết nối đến server';
  },

  // Lấy chi tiết caregiver (public - không cần đăng nhập)
  getCaregiverDetail: async (caregiverId) => {
    try {
      const response = await publicAxiosInstance.get(API_ENDPOINTS.CUSTOMER.CAREGIVER_DETAIL(caregiverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy reviews của caregiver (public - không cần đăng nhập)
  getCaregiverReviews: async (caregiverId) => {
    try {
      const response = await publicAxiosInstance.get(API_ENDPOINTS.CUSTOMER.CAREGIVER_REVIEWS(caregiverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách services (public - không cần đăng nhập)
  getServices: async () => {
    try {
      const response = await publicAxiosInstance.get('/api/auth/services');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default publicService;
