import { useState } from 'react';
import { runApiTests, testLogin, testRegisterCustomer, testRegisterCaregiver } from '../utils/apiTest';

export default function ApiTester() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testAllApis = async () => {
    setLoading(true);
    clearResults();
    addResult('🚀 Starting comprehensive API tests...', 'info');
    
    try {
      await runApiTests();
      addResult('✅ All API tests completed successfully', 'success');
    } catch (error) {
      addResult(`❌ API tests failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testSpecificLogin = async (email, password, role) => {
    setLoading(true);
    addResult(`🔐 Testing ${role} login...`, 'info');
    
    try {
      const result = await testLogin({ email, password });
      addResult(`✅ ${role} login successful: ${result.data.fullName}`, 'success');
    } catch (error) {
      addResult(`❌ ${role} login failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testCustomerRegistration = async () => {
    setLoading(true);
    addResult('👤 Testing customer registration...', 'info');
    
    const testData = {
      email: `test-customer-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Customer',
      phoneNumber: '0901234567',
      address: '123 Test Street, Test City'
    };

    try {
      const result = await testRegisterCustomer(testData);
      addResult(`✅ Customer registration successful: ${result.data.fullName}`, 'success');
    } catch (error) {
      addResult(`❌ Customer registration failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testCaregiverRegistration = async () => {
    setLoading(true);
    addResult('🩺 Testing caregiver registration...', 'info');
    
    const testData = {
      email: `test-caregiver-${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test Caregiver',
      phoneNumber: '0912345678',
      address: '456 Test Avenue, Test City',
      idCardNumber: '079123456789',
      bio: 'Test caregiver with experience',
      skills: 'Elder care, Medical care',
      yearsOfExperience: 3,
      certifications: 'Test certification'
    };

    try {
      const result = await testRegisterCaregiver(testData);
      addResult(`✅ Caregiver registration successful: ${result.data.fullName}`, 'success');
    } catch (error) {
      addResult(`❌ Caregiver registration failed: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">API Tester</h2>
      
      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testAllApis}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Test All APIs
        </button>
        
        <button
          onClick={() => testSpecificLogin('admin@careservice.com', 'admin123', 'Admin')}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
        >
          Test Admin Login
        </button>
        
        <button
          onClick={() => testSpecificLogin('customer@example.com', 'customer123', 'Customer')}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          Test Customer Login
        </button>
        
        <button
          onClick={() => testSpecificLogin('caregiver@example.com', 'caregiver123', 'Caregiver')}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
        >
          Test Caregiver Login
        </button>
        
        <button
          onClick={testCustomerRegistration}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Test Customer Registration
        </button>
        
        <button
          onClick={testCaregiverRegistration}
          disabled={loading}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:bg-gray-400"
        >
          Test Caregiver Registration
        </button>
      </div>

      {/* Clear Results Button */}
      <div className="mb-4">
        <button
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      {/* Results Display */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Test Results:</h3>
        {results.length === 0 ? (
          <p className="text-gray-500">No test results yet. Click a test button to start.</p>
        ) : (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  result.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : result.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                <span className="text-xs text-gray-500">[{result.timestamp}]</span> {result.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Testing...
          </div>
        </div>
      )}
    </div>
  );
}