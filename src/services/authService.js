import axiosInstance from '@api/axiosConfig';
import { API_ENDPOINTS } from '@api/endpoints';

// Authentication service
export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },
};

export default authService;
