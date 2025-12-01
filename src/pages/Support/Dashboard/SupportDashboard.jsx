import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, UserCheck, Star, TrendingUp, BarChart3 } from 'lucide-react';
import Swal from 'sweetalert2';
import StatCard from '@components/admin/StatCard';
import Loading from '@components/common/Loading';
import axiosInstance from '@api/axiosConfig';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalCaregivers: 0,
    activeCaregivers: 0,
    totalReviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [bookingsRes, usersRes, reviewsRes] = await Promise.all([
        axiosInstance.get('/api/admin/bookings').catch(() => ({ data: { data: { content: [] } } })),
        axiosInstance.get('/api/admin/users').catch(() => ({ data: { data: { content: [] } } })),
        axiosInstance.get('/api/admin/reviews/list').catch(() => ({ data: { data: [] } })),
      ]);

      // Backend trả về Page object với content array
      const bookings = bookingsRes.data.data?.content || [];
      const users = usersRes.data.data?.content || [];
      const reviews = reviewsRes.data.data || [];

      const customers = users.filter((u) => u.role === 'CUSTOMER' || u.role === 'ROLE_CUSTOMER');
      const caregivers = users.filter((u) => u.role === 'CAREGIVER' || u.role === 'ROLE_CAREGIVER');

      const avgRating =
        reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
        totalCustomers: customers.length,
        activeCustomers: customers.filter((c) => c.active).length,
        totalCaregivers: caregivers.length,
        activeCaregivers: caregivers.filter((c) => c.active).length,
        totalReviews: reviews.length,
        avgRating,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải dữ liệu dashboard',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Support Dashboard</h1>
        <p className="text-chilled-gray-500 mt-2">Tổng quan hệ thống quản lý</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => navigate('/support/bookings')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-chilled-gray-500 mb-1">Tổng Bookings</p>
              <p className="text-3xl font-bold text-charcoal-900">{stats.totalBookings}</p>
              <p className="text-sm text-yellow-600 mt-1">{stats.pendingBookings} chờ xác nhận</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/support/customers')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-chilled-gray-500 mb-1">Customers</p>
              <p className="text-3xl font-bold text-charcoal-900">{stats.totalCustomers}</p>
              <p className="text-sm text-green-600 mt-1">{stats.activeCustomers} hoạt động</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/support/caregivers')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-chilled-gray-500 mb-1">Caregivers</p>
              <p className="text-3xl font-bold text-charcoal-900">{stats.totalCaregivers}</p>
              <p className="text-sm text-green-600 mt-1">{stats.activeCaregivers} hoạt động</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <UserCheck className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/support/reviews')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-chilled-gray-500 mb-1">Đánh giá</p>
              <p className="text-3xl font-bold text-charcoal-900">{stats.totalReviews}</p>
              <p className="text-sm text-yellow-600 mt-1">⭐ {stats.avgRating} trung bình</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-charcoal-900 mb-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/support/bookings')}
            className="flex flex-col items-center justify-center p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Calendar className="text-blue-600 mb-2" size={32} />
            <span className="font-semibold text-charcoal-900">Quản lý Booking</span>
          </button>

          <button
            onClick={() => navigate('/support/customers')}
            className="flex flex-col items-center justify-center p-6 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Users className="text-green-600 mb-2" size={32} />
            <span className="font-semibold text-charcoal-900">Quản lý Customers</span>
          </button>

          <button
            onClick={() => navigate('/support/caregivers')}
            className="flex flex-col items-center justify-center p-6 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <UserCheck className="text-purple-600 mb-2" size={32} />
            <span className="font-semibold text-charcoal-900">Quản lý Caregivers</span>
          </button>

          <button
            onClick={() => navigate('/support/reviews')}
            className="flex flex-col items-center justify-center p-6 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <Star className="text-yellow-600 mb-2" size={32} />
            <span className="font-semibold text-charcoal-900">Quản lý Đánh giá</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-charcoal-900" size={20} />
            <h2 className="text-xl font-semibold text-charcoal-900">Thống kê Bookings</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-chilled-gray-600">Tổng số</span>
              <span className="font-semibold text-charcoal-900">{stats.totalBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-chilled-gray-600">Chờ xác nhận</span>
              <span className="font-semibold text-yellow-600">{stats.pendingBookings}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-charcoal-900" size={20} />
            <h2 className="text-xl font-semibold text-charcoal-900">Thống kê Users</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-chilled-gray-600">Customers</span>
              <span className="font-semibold text-green-600">
                {stats.activeCustomers}/{stats.totalCustomers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-chilled-gray-600">Caregivers</span>
              <span className="font-semibold text-purple-600">
                {stats.activeCaregivers}/{stats.totalCaregivers}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
