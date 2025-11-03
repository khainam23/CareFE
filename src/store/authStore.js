import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  // Initialize auth state
  initAuth: () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ user, isAuthenticated });
  },

  // Login
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authService.login(credentials);
      if (response.success) {
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

  // Register Customer
  registerCustomer: async (customerData) => {
    set({ loading: true });
    try {
      const response = await authService.registerCustomer(customerData);
      if (response.success) {
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
      if (response.success) {
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
    set({ user: null, isAuthenticated: false });
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user?.roles?.includes(role) || false;
  },

  // Update user info
  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  }
}));

export default useAuthStore;