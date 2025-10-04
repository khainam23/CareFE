import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Example auth store slice
export const useAuthStore = create(
  devtools((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setToken: (token) => set({ token }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
  }))
);

export default useAuthStore;
