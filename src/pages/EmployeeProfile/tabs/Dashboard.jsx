import { useState, useEffect } from 'react';
import { Clock, Users, Calendar, User } from 'lucide-react';
import CardBg from '@/assets/images/Card.svg';
import { caregiverService } from '@/services/caregiverService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await caregiverService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      // API chưa có, sử dụng dữ liệu mặc định
      console.warn('Dashboard stats API not available yet:', err);
      setStats({
        monthlyEarnings: 0,
        earningsGrowth: 0,
        weeklyHours: 0,
        todayBookings: 0,
        upcomingAppointments: [],
        recentPatients: []
      });
      setError(null); // Không hiển thị lỗi cho user
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Thu nhập cá nhân */}
      <div className="lg:col-span-6 md:col-span-6">
        <div 
          className="rounded-lg shadow-md p-6  relative overflow-hidden"
          style={{ backgroundImage: `url(${CardBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <span className="text-sm font-medium opacity-90">Số tiền thu nhập tháng này</span>
            <span className="block text-3xl font-bold mt-2">
              {stats?.monthlyEarnings?.toLocaleString('vi-VN') || '0'} đ
            </span>
            <span className="block text-sm font-medium mt-4 text-green-100">
              {stats?.earningsGrowth > 0 ? '↑' : '↓'} {stats?.earningsGrowth || 0}% so với tháng trước
            </span>
          </div>
        </div>
      </div>

      {/* Số giờ làm trong tuần này */}
      <div className="lg:col-span-3 md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Số giờ làm tuần này</span>
            <Clock size={24} className="text-orange-500" />
          </div>
          <span className="block text-3xl font-bold text-gray-900">{stats?.weeklyHours || 0}</span>
          <span className="block text-xs text-gray-500 mt-2">giờ</span>
        </div>
      </div>

      {/* Số ca chăm sóc hôm nay */}
      <div className="lg:col-span-3 md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Số ca chăm sóc hôm nay</span>
            <Users size={24} className="text-green-500" />
          </div>
          <span className="block text-3xl font-bold text-gray-900">{stats?.todayBookings || 0}</span>
          <span className="block text-xs text-gray-500 mt-2">ca</span>
        </div>
      </div>

      {/* Cuộc hẹn sắp tới */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-red-500" />
            <span className="text-sm font-medium text-gray-600">Cuộc hẹn sắp tới</span>
          </div>
          <div className="space-y-3">
            {stats?.upcomingAppointments?.length > 0 ? (
              stats.upcomingAppointments.slice(0, 2).map((appointment, index) => (
                <div key={index} className="text-sm">
                  <span className="block font-medium text-gray-900">{appointment.customerName}</span>
                  <span className="block text-xs text-gray-500">{appointment.time}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Không có cuộc hẹn sắp tới</div>
            )}
          </div>
        </div>
      </div>

      {/* Bệnh nhân gần đây */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Bệnh nhân gần đây</span>
          </div>
          <div className="space-y-3">
            {stats?.recentPatients?.length > 0 ? (
              stats.recentPatients.slice(0, 2).map((patient, index) => (
                <div key={index} className="text-sm">
                  <span className="block font-medium text-gray-900">{patient.name}</span>
                  <span className="block text-xs text-gray-500">{patient.lastCare}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Chưa có bệnh nhân gần đây</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
