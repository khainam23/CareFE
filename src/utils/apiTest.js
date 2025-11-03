// Utility to test API connection
import axiosInstance from '../api/axiosConfig';

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test basic connection
    const response = await axiosInstance.get('/api/auth/login');
    console.log('API connection test failed as expected (no credentials)');
    return false;
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 401) {
      console.log('✅ API connection successful! Backend is running.');
      return true;
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend. Make sure backend is running on http://localhost:8080');
      return false;
    } else {
      console.error('❌ API connection error:', error.message);
      return false;
    }
  }
};

export const testLogin = async (credentials) => {
  try {
    console.log('Testing login with credentials:', credentials);
    const response = await axiosInstance.post('/api/auth/login', credentials);
    console.log('✅ Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const testRegisterCustomer = async (customerData) => {
  try {
    console.log('Testing customer registration:', customerData);
    const response = await axiosInstance.post('/api/auth/register/customer', customerData);
    console.log('✅ Customer registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Customer registration failed:', error.response?.data || error.message);
    throw error;
  }
};

export const testRegisterCaregiver = async (caregiverData) => {
  try {
    console.log('Testing caregiver registration:', caregiverData);
    const response = await axiosInstance.post('/api/auth/register/caregiver', caregiverData);
    console.log('✅ Caregiver registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Caregiver registration failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test with sample data
export const runApiTests = async () => {
  console.log('🚀 Starting API tests...');
  
  // Test connection
  const isConnected = await testApiConnection();
  if (!isConnected) {
    console.log('❌ Cannot proceed with tests - backend not available');
    return;
  }

  // Test login with admin account
  try {
    await testLogin({
      email: 'admin@careservice.com',
      password: 'admin123'
    });
  } catch (error) {
    console.log('Admin login test completed');
  }

  // Test login with customer account
  try {
    await testLogin({
      email: 'customer@example.com',
      password: 'customer123'
    });
  } catch (error) {
    console.log('Customer login test completed');
  }

  // Test customer registration
  try {
    await testRegisterCustomer({
      email: 'test-customer@example.com',
      password: 'password123',
      fullName: 'Test Customer',
      phoneNumber: '0901234567',
      address: '123 Test Street, Test City'
    });
  } catch (error) {
    console.log('Customer registration test completed');
  }

  console.log('🏁 API tests completed');
};

export default {
  testApiConnection,
  testLogin,
  testRegisterCustomer,
  testRegisterCaregiver,
  runApiTests
};