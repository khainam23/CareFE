import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRedirecting = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - chỉ redirect nếu không phải là request login
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isRegisterRequest = error.config?.url?.includes('/auth/register');
      
      console.log('=== 401 INTERCEPTOR ===');
      console.log('URL:', error.config?.url);
      console.log('Is login/register:', isLoginRequest || isRegisterRequest);
      console.log('Current path:', window.location.pathname);
      
      // Chỉ logout nếu không phải login/register và chưa đang redirect
      if (!isLoginRequest && !isRegisterRequest && !isRedirecting) {
        // Kiểm tra xem có đang ở trang login không
        if (window.location.pathname !== '/login') {
          console.log('Clearing localStorage and redirecting to login');
          isRedirecting = true;
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Reset flag sau khi redirect
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
          
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
