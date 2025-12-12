import { create } from 'zustand';
import { authService } from '../services/authService';

// Initialize state from localStorage immediately
const initializeState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('=== STORE INITIALIZED FROM LOCALSTORAGE ===');
      console.log('User:', user.email);
      console.log('Roles:', user.roles);
      return { user, isAuthenticated: true };
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return { user: null, isAuthenticated: false };
};

const initialState = initializeState();

export const useAuthStore = create((set, get) => ({
  user: initialState.user,
  token: localStorage.getItem('token'),
  isAuthenticated: initialState.isAuthenticated,
  loading: false,

  // Initialize auth state
  initAuth: () => {
    console.log('=== INIT AUTH CALLED ===');
    console.log('LocalStorage token:', localStorage.getItem('token'));
    console.log('LocalStorage user:', localStorage.getItem('user'));

    const token = authService.getToken();
    const user = authService.getCurrentUser();
    const isAuthenticated = !!token && !!user;

    console.log('InitAuth - Token exists:', !!token);
    console.log('InitAuth - User:', user);
    console.log('InitAuth - IsAuth:', isAuthenticated);

    if (token && !user) {
      console.error('WARNING: Token exists but user is null!');
    }
    if (!token && user) {
      console.error('WARNING: User exists but token is null!');
    }

    set({ user, isAuthenticated, token });
  },

  // Login
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        console.log('Login success, setting user:', response.data);

        // Đảm bảo data được lưu vào localStorage trước
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        // Sau đó mới update state
        set({
          user: response.data,
          isAuthenticated: true,
          loading: false
        });

        console.log('Auth state updated:', {
          user: response.data.email,
          isAuthenticated: true
        });

        return response;
      }
      set({ loading: false });
      throw new Error(response.message || 'Đăng nhập thất bại');
    } catch (error) {
      set({ loading: false, user: null, isAuthenticated: false });
      throw error;
    }
  },

  // Register Customer
  registerCustomer: async (customerData) => {
    set({ loading: true });
    try {
      const response = await authService.registerCustomer(customerData);
      if (response.success && response.data) {
        // Lưu vào localStorage trước
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        // Sau đó update state
        set({
          user: response.data,
          isAuthenticated: true,
          loading: false
        });
        return response;
      }
      throw new Error(response.message);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Register Caregiver
  registerCaregiver: async (caregiverData) => {
    set({ loading: true });
    try {
      const response = await authService.registerCaregiver(caregiverData);
      if (response.success && response.data) {
        // Lưu vào localStorage trước
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        // Sau đó update state
        set({
          user: response.data,
          isAuthenticated: true,
          loading: false
        });
        return response;
      }
      throw new Error(response.message);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    if (!user?.roles) return false;

    // Xử lý cả trường hợp có và không có prefix ROLE_
    const roleToCheck = role.startsWith('ROLE_') ? role : `ROLE_${role.toUpperCase()}`;
    return user.roles.some(r =>
      r === roleToCheck || r === role || r.replace('ROLE_', '') === role.toUpperCase()
    );
  },

  // Update user info
  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    set({ user: updatedUser });
    // Sync to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
}));

export default useAuthStore;