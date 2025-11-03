import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();
      
      if (currentUser && token) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (customerData) => {
    try {
      setLoading(true);
      const response = await authService.registerCustomer(customerData);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerCaregiver = async (caregiverData) => {
    try {
      setLoading(true);
      const response = await authService.registerCaregiver(caregiverData);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return response;
      }
      throw new Error(response.message);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    registerCustomer,
    registerCaregiver,
    logout,
    hasRole
  };
};

export default useAuth;