import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import axiosInstance from '@api/axiosConfig';
import Swal from 'sweetalert2';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Sử dụng admin endpoint để lấy tất cả bookings
      const response = await axiosInstance.get('/api/admin/bookings');
      if (response.data.success) {
        // Backend trả về Page object với content array
        const bookingsData = response.data.data?.content || response.data.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận' },
      IN_PROGRESS: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đang thực hiện' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn thành' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.caregiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Quản lý Booking</h1>
        <p className="text-chilled-gray-500">Xem và quản lý tất cả các booking trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chilled-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, caregiver, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chilled-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-chilled-gray-50 border-b border-chilled-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  Caregiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  Ngày bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-chilled-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-chilled-gray-500">
                    Không tìm thấy booking nào
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  // Calculate duration in hours
                  const duration = booking.scheduledStartTime && booking.scheduledEndTime
                    ? Math.round((new Date(booking.scheduledEndTime) - new Date(booking.scheduledStartTime)) / (1000 * 60 * 60))
                    : 0;
                  
                  return (
                    <tr key={booking.id} className="hover:bg-chilled-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal-900">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-charcoal-900">
                          {booking.customerName || 'N/A'}
                        </div>
                        <div className="text-sm text-chilled-gray-500">ID: {booking.customerId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-charcoal-900">
                          {booking.caregiverName || 'Chưa phân công'}
                        </div>
                        <div className="text-sm text-chilled-gray-500">
                          {booking.caregiverId ? `ID: ${booking.caregiverId}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-chilled-gray-900">
                        {booking.scheduledStartTime 
                          ? new Date(booking.scheduledStartTime).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-chilled-gray-900">
                        {duration} giờ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal-900">
                        {booking.totalPrice?.toLocaleString('vi-VN') || '0'} đ
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Tổng booking</div>
          <div className="text-2xl font-bold text-charcoal-900">{bookings.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Chờ xác nhận</div>
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Đang thực hiện</div>
          <div className="text-2xl font-bold text-blue-600">
            {bookings.filter((b) => b.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Hoàn thành</div>
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === 'COMPLETED').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsList;
