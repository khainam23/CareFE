import { useState, useEffect } from 'react';
import Rectangle131 from '@/assets/images/Rectangle 131.svg';
import { caregiverService } from '@/services/caregiverService';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await caregiverService.getBookings();
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Không thể tải dữ liệu');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await caregiverService.acceptBooking(bookingId);
      if (response.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Không thể chấp nhận đơn');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = prompt('Lý do từ chối:');
    if (!reason) return;
    
    try {
      const response = await caregiverService.rejectBooking(bookingId, reason);
      if (response.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Không thể từ chối đơn');
    }
  };

  // Mock data for fixed schedule
  const fixedSchedule = [
    { day: 'Thứ 2', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 3', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 4', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 5', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 6', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 7', hours: 'Nghỉ', status: 'Ngày nghỉ' },
    { day: 'Chủ nhật', hours: 'Nghỉ', status: 'Ngày nghỉ' },
  ];

  // Filter bookings by status
  const getFilteredBookings = () => {
    if (!bookings || bookings.length === 0) return [];
    
    switch (activeTab) {
      case 'pending':
        return bookings.filter(b => b.status === 'ASSIGNED' || b.status === 'PENDING');
      case 'approved':
        return bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
      case 'cancelled':
        return bookings.filter(b => b.status === 'CANCELLED' || b.status === 'REJECTED');
      default:
        return bookings;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    const start = new Date(startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const end = new Date(endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `${start} - ${end}`;
  };

  const formatPrice = (price) => {
    if (!price) return '0 đ';
    return `${price.toLocaleString('vi-VN')} đ`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();

  return (
    <div className="space-y-6">
      {/* Lịch làm việc của nhân viên */}
      {/* Mục thông tin lịch làm việc cố định */}
      <div className="bg-white rounded-lg flex shadow-md overflow-hidden">
        <div
          className="relative bg-cover bg-center p-6 "
          style={{ backgroundImage: `url(${Rectangle131})`, backgroundSize: 'cover' }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">Lịch làm việc cố định</h2>
            {/* Khoảng ngày làm việc */}
            <span className="block text-sm opacity-90 mb-1">Từ: 01/01/2025 - Đến: 31/12/2025</span>

            {/* Ngày hôm nay */}
            <span className="block text-sm opacity-90 mb-1">Hôm nay: 14/01/2025</span>

            {/* Giờ làm việc */}
            <span className="block text-sm font-semibold">Giờ làm việc: 40 giờ/tuần</span>
          </div>
        </div>

        {/* Các ngày trong tuần */}
        <div className="p-6 w-full">
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Giờ</th>
                {/* Gồm: Hoạt động hôm nay, ngày nghỉ, hoạt động */}
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {fixedSchedule.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{item.day}</td>
                  <td className="py-3 px-4 text-gray-600">{item.hours}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'Hoạt động'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-3">
            <button className="flex-1 bg-teal-500  py-2 px-4 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
              Đồng ý lịch làm
            </button>
            <button className="flex-1 bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
              Gửi yêu cầu thay đổi lịch
            </button>
          </div>
        </div>
      </div>

      {/* Các cuộc hẹn, hiển thị phân trang */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Yêu cầu đặt lịch
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'approved'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đơn đã đồng ý
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'cancelled'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đơn đã hủy
          </button>
        </div>

        <div className="p-6 space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{appointment.customerName}</h4>
                
                {/* Họ và tên */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-600">Họ và tên: </span>
                  <span className="text-sm text-gray-900">{appointment.customerName}</span>
                </div>
                
                {/* Thời gian */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-600">Thời gian: </span>
                  <span className="text-sm text-gray-900">{formatDate(appointment.scheduledStartTime)}</span>
                </div>
                
                {/* Giờ */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-600">Giờ: </span>
                  <span className="text-sm text-gray-900">{formatTime(appointment.scheduledStartTime, appointment.scheduledEndTime)}</span>
                </div>
                
                {/* Địa điểm */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-600">Địa điểm: </span>
                  <span className="text-sm text-gray-900">{appointment.location || 'Chưa cập nhật'}</span>
                </div>
                
                {/* Chú thích về bệnh nhân nếu có */}
                {appointment.customerNote && (
                  <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-teal-500">
                    <span className="text-sm font-semibold text-gray-600">Ghi chú: </span>
                    <span className="text-sm text-gray-900">{appointment.customerNote}</span>
                  </div>
                )}

                <div className="flex gap-3 items-center">
                  {/* Giá tiền */}
                  <div className="flex-1">
                    <span className="text-lg font-bold text-teal-600">{formatPrice(appointment.totalPrice)}</span>
                  </div>
                  
                  {/* Hoạt động */}
                  <div className="flex gap-2">
                    {activeTab === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleAcceptBooking(appointment.id)}
                          className="bg-green-500  py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                        >
                          Xác nhận đơn
                        </button>
                        <button 
                          onClick={() => handleRejectBooking(appointment.id)}
                          className="bg-red-500  py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                        >
                          Từ chối đơn
                        </button>
                      </>
                    )}
                    <button className="bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-sm">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có đơn đặt lịch nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
