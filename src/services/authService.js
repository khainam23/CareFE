import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error details:', error.response?.data || error);
      const errorData = error.response?.data;
      if (errorData) {
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }
      throw new Error(error.message || 'Có lỗi xảy ra khi đăng nhập');
    }
  },

  // Đăng ký khách hàng
  registerCustomer: async (customerData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER_CUSTOMER, customerData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng ký chuyên viên chăm sóc
  registerCaregiver: async (caregiverData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER_CAREGIVER, caregiverData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra đã đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;