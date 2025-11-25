import { useState } from 'react';
import ApiTester from '../../components/ApiTester';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Server, Wifi } from 'lucide-react';

export default function ApiTestPage() {
  const [backendStatus, setBackendStatus] = useState('checking');

  const checkBackendStatus = async () => {
    setBackendStatus('checking');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' })
      });
      
      if (response.status === 400) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  useState(() => {
    checkBackendStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">API Test Center</h1>
          <p className="mt-2 text-gray-600">
            Test và debug các API endpoints của hệ thống Care Service
          </p>
        </div>

        {/* Backend Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="w-6 h-6 text-gray-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Backend Status</h3>
                <p className="text-sm text-gray-600">http://localhost:8080</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                backendStatus === 'online' 
                  ? 'bg-green-100 text-green-800'
                  : backendStatus === 'offline'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <Wifi className="w-4 h-4 mr-2" />
                {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
              </div>
              
              <button
                onClick={checkBackendStatus}
                className="bg-blue-600  px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-600">Sample data loaded</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>• 4 test accounts</p>
              <p>• 7 services</p>
              <p>• 1 approved caregiver</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Wifi className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">CORS</h3>
                <p className="text-sm text-gray-600">Configured for Vite</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>• localhost:3000</p>
              <p>• localhost:4200</p>
              <p>• localhost:5173 ✓</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Server className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Endpoints</h3>
                <p className="text-sm text-gray-600">All APIs ready</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>• Authentication</p>
              <p>• Customer/Caregiver</p>
              <p>• Admin/Support</p>
            </div>
          </div>
        </div>

        {/* API Tester Component */}
        <ApiTester />

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/login"
              className="bg-blue-600  px-4 py-2 rounded-md hover:bg-blue-700 text-center"
            >
              Login Page
            </Link>
            <Link
              to="/signup"
              className="bg-green-600  px-4 py-2 rounded-md hover:bg-green-700 text-center"
            >
              Signup Page
            </Link>
            <Link
              to="/dashboard"
              className="bg-purple-600  px-4 py-2 rounded-md hover:bg-purple-700 text-center"
            >
              Dashboard
            </Link>
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600  px-4 py-2 rounded-md hover:bg-gray-700 text-center"
            >
              Backend API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}