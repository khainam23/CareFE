import { useState, useEffect } from 'react';
import Rectangle131 from '@/assets/images/Rectangle 131.svg';
import { caregiverService } from '@/services/caregiverService';
import { MessageCircle } from 'lucide-react';
import chatService from '@/services/chatService';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatRooms, setChatRooms] = useState({}); // Map appointmentId to chatRoom
  const [openChatIds, setOpenChatIds] = useState(new Set()); // Track which appointments have chat open
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuthStore();

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetailsModal = () => {
    setSelectedBooking(null);
  };

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

  const handleOpenChat = async (appointmentId) => {
    try {
      // If chat is already loaded, just toggle it
      if (chatRooms[appointmentId]) {
        setOpenChatIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(appointmentId)) {
            newSet.delete(appointmentId);
          } else {
            newSet.add(appointmentId);
          }
          return newSet;
        });
        return;
      }

      console.log('Opening chat for booking ID:', appointmentId);
      
      // Try to create chat room first (will create if not exists)
      try {
        console.log('Creating chat room for booking:', appointmentId);
        const createResponse = await chatService.createChatRoomForBooking(appointmentId);
        
        if (createResponse?.data && createResponse.data.id) {
          const chatRoom = createResponse.data;
          setChatRooms(prev => ({
            ...prev,
            [appointmentId]: chatRoom
          }));
          setOpenChatIds(prev => new Set(prev).add(appointmentId));
          return;
        }
      } catch (createErr) {
        console.warn('Failed to create chat room, trying to fetch existing:', createErr);
      }
      
      // Fallback: Try to fetch existing chat room
      const chatRoomResponse = await chatService.getChatRoomByBooking(appointmentId);
      
      const chatRoom = chatRoomResponse?.data;
      
      if (chatRoom && chatRoom.id) {
        setChatRooms(prev => ({
          ...prev,
          [appointmentId]: chatRoom
        }));
        setOpenChatIds(prev => new Set(prev).add(appointmentId));
      } else {
        // Still no chat room, open with temporary object for pending bookings
        console.log('Chat room still not available, opening pending chat');
        const appointment = bookings.find(a => a.id === appointmentId);
        const tempChatRoom = {
          id: `temp_${appointmentId}`,
          bookingId: appointmentId,
          customerId: appointment?.customerId,
          caregiverId: user?.id,
          caregiverName: user?.fullName || 'Bạn',
          customerName: appointment?.customerName,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
        setChatRooms(prev => ({
          ...prev,
          [appointmentId]: tempChatRoom
        }));
        setOpenChatIds(prev => new Set(prev).add(appointmentId));
      }
    } catch (err) {
      console.error('Error opening chat:', err);
      const errorMessage = err.response?.data?.message || 'Không thể mở chat với khách hàng';
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
      });
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
        return bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
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
                          className="text-white bg-green-500  py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                        >
                          Xác nhận đơn
                        </button>
                        <button 
                          onClick={() => handleRejectBooking(appointment.id)}
                          className="text-white bg-red-500  py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                        >
                          Từ chối đơn
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleViewDetails(appointment)}
                      className="bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-sm"
                    >
                      Xem chi tiết
                    </button>
                    {/* <button 
                      onClick={() => handleOpenChat(appointment.id)}
                      className={`flex items-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
                        openChatIds.has(appointment.id)
                          ? 'bg-blue-700 '
                          : 'bg-blue-600  hover:bg-blue-700'
                      }`}
                    >
                      <MessageCircle size={16} />
                      {openChatIds.has(appointment.id) ? 'Đóng chat' : 'Chat'}
                    </button> */}
                  </div>
                </div>
                
                {/* Chat Window - Inline */}
                {openChatIds.has(appointment.id) && chatRooms[appointment.id] && user && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px] relative">
                      <ChatWindow
                        chatRoom={chatRooms[appointment.id]}
                        onClose={() => {
                          setOpenChatIds(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(appointment.id);
                            return newSet;
                          });
                        }}
                        currentUserId={user.id}
                        inline={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không có đơn đặt lịch nào
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-teal-600 p-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold">Chi tiết đơn đặt lịch</h3>
              <button onClick={closeDetailsModal} className="hover:bg-teal-700 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Service Info */}
              <div className="pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Dịch vụ</p>
                <p className="text-lg font-semibold text-gray-900">{selectedBooking.serviceName || 'Dịch vụ chăm sóc'}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  selectedBooking.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                  selectedBooking.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  selectedBooking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  selectedBooking.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-800' :
                  selectedBooking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedBooking.status === 'PENDING' ? 'Chờ xác nhận' :
                   selectedBooking.status === 'ASSIGNED' ? 'Đã phân công' :
                   selectedBooking.status === 'ACCEPTED' ? 'Đã chấp nhận' :
                   selectedBooking.status === 'CONFIRMED' ? 'Đã xác nhận' :
                   selectedBooking.status === 'IN_PROGRESS' ? 'Đang thực hiện' :
                   selectedBooking.status === 'COMPLETED' ? 'Hoàn thành' :
                   selectedBooking.status === 'CANCELLED' ? 'Đã hủy' :
                   selectedBooking.status === 'REJECTED' ? 'Đã từ chối' : selectedBooking.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Khách hàng</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium">{selectedBooking.customerPhone || '---'}</p>
                </div>
              </div>

              {/* Time */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span className="font-medium">{formatDate(selectedBooking.scheduledStartTime)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{formatTime(selectedBooking.scheduledStartTime, selectedBooking.scheduledEndTime)}</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Địa điểm</p>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <p className="text-gray-900">{selectedBooking.location || 'Chưa cập nhật'}</p>
                </div>
              </div>

              {/* Note */}
              {selectedBooking.customerNote && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ghi chú từ khách hàng</p>
                  <div className="bg-yellow-50 border border-yellow-100 p-3 rounded text-sm text-gray-800">
                    {selectedBooking.customerNote}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-semibold text-gray-700">Tổng tiền</span>
                <span className="text-xl font-bold text-teal-600">{formatPrice(selectedBooking.totalPrice)}</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
