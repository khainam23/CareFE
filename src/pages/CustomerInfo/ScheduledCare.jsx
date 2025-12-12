import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Star, Check, X, ChevronDown, Loader2, MessageCircle } from 'lucide-react';
import { customerService } from '@/services/customerService';
import chatService from '@/services/chatService';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

const ScheduledCare = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatRooms, setChatRooms] = useState({}); // Map appointmentId to chatRoom
  const [openChatIds, setOpenChatIds] = useState(new Set()); // Track which appointments have chat open
  const [chatRetries, setChatRetries] = useState({}); // Track retry counts
  const { user } = useAuthStore();

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getBookings();
      
      console.log('Bookings response:', response);
      
      if (response.success && response.data) {
        // Transform API data to match component structure
        const transformedData = response.data.map(booking => ({
          id: booking.id,
          caregiver: booking.caregiverName || 'Người chăm sóc',
          service: booking.serviceType || 'Dịch vụ chăm sóc',
          date: formatDate(booking.startDate),
          time: `${formatTime(booking.startTime)}${booking.endTime ? ' - ' + formatTime(booking.endTime) : ''}`,
          address: booking.address || '',
          status: mapStatus(booking.status),
          rating: booking.rating || null,
          rawData: booking, // Keep original data for reference
        }));
        setAppointments(transformedData);
      } else {
        const errorMsg = response.message || 'Không thể tải lịch chăm sóc';
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải lịch chăm sóc';
      setError(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải dữ liệu',
        text: errorMessage,
        confirmButtonText: 'Thử lại',
        showCancelButton: true,
        cancelButtonText: 'Đóng',
      }).then((result) => {
        if (result.isConfirmed) {
          fetchBookings();
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Map API status to component status
  const mapStatus = (apiStatus) => {
    const statusMap = {
      'PENDING': 'pending',
      'CONFIRMED': 'confirmed',
      'IN_PROGRESS': 'confirmed',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
    };
    return statusMap[apiStatus] || 'pending';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:mm
  };

  const handleRating = async (id, rating) => {
    try {
      const appointment = appointments.find(apt => apt.id === id);
      if (!appointment) return;

      // Call API to create review
      const response = await customerService.createReview({
        bookingId: id,
        caregiverId: appointment.rawData?.caregiverId,
        rating: rating,
        comment: '', // Can add comment field later
      });

      if (response.success) {
        setAppointments(appointments.map(apt =>
          apt.id === id ? { ...apt, rating } : apt
        ));
        
        Swal.fire({
          icon: 'success',
          title: 'Cảm ơn!',
          text: 'Đánh giá của bạn đã được ghi nhận',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error rating appointment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể gửi đánh giá',
      });
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'Xác nhận hủy',
      text: 'Bạn có chắc muốn hủy buổi chăm sóc này?',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'Lý do hủy (không bắt buộc)',
      showCancelButton: true,
      confirmButtonText: 'Hủy buổi',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      try {
        const response = await customerService.cancelBooking(id, result.value || '');
        
        if (response.success) {
          // Update local state
          setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, status: 'cancelled' } : apt
          ));
          
          Swal.fire({
            icon: 'success',
            title: 'Đã hủy',
            text: 'Buổi chăm sóc đã được hủy thành công',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.message || 'Không thể hủy buổi chăm sóc',
        });
      }
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
        console.log('Create chat room response:', createResponse);
        
        if (createResponse?.data && createResponse.data.id) {
          const chatRoom = createResponse.data;
          console.log('Chat room created/retrieved successfully, ID:', chatRoom.id);
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
      console.log('Chat room response:', chatRoomResponse);
      
      const chatRoom = chatRoomResponse?.data;
      
      if (chatRoom && chatRoom.id) {
        console.log('Chat room loaded, ID:', chatRoom.id);
        setChatRooms(prev => ({
          ...prev,
          [appointmentId]: chatRoom
        }));
        setOpenChatIds(prev => new Set(prev).add(appointmentId));
      } else {
        // Still no chat room, open with temporary object for pending bookings
        console.log('Chat room still not available, opening pending chat');
        const appointment = appointments.find(a => a.id === appointmentId);
        const tempChatRoom = {
          id: `temp_${appointmentId}`,
          bookingId: appointmentId,
          customerId: user?.id,
          caregiverId: appointment?.rawData?.caregiverId,
          caregiverName: appointment?.caregiver,
          customerName: user?.fullName || 'Bạn',
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
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.message);
      
      const errorMessage = err.response?.data?.message || 'Không thể mở chat với caregiver';
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
      });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { bg: 'bg-blue-600', text: '', label: 'Xác nhận' },
      completed: { bg: 'bg-green-600', text: '', label: 'Hoàn thành' },
      pending: { bg: 'bg-red-500', text: '', label: 'Chờ xác nhận' },
      cancelled: { bg: 'bg-red-800', text: '', label: 'Hủy' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải lịch chăm sóc...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-gray-700 text-base font-medium mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-8 py-3 bg-teal-600  rounded-lg hover:bg-teal-700 transition-colors font-bold text-base"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-teal-700">Lịch chăm sóc đã đặt</h2>
        <p className="text-gray-700 mt-2 text-lg">Quản lý các buổi chăm sóc của bạn</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-md">
          <p className="text-gray-700 text-base font-bold">Tổng buổi</p>
          <p className="text-5xl font-bold text-gray-900 mt-3">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-lg border-2 border-red-300 p-6 shadow-md">
          <p className="text-gray-700 text-base font-bold">Chờ xác nhận</p>
          <p className="text-5xl font-bold text-yellow-600 mt-3">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border-2 border-blue-300 p-6 shadow-md">
          <p className="text-gray-700 text-base font-bold">Đã xác nhận</p>
          <p className="text-5xl font-bold text-blue-700 mt-3">
            {appointments.filter(a => a.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border-2 border-green-300 p-6 shadow-md">
          <p className="text-gray-700 text-base font-bold">Hoàn thành</p>
          <p className="text-5xl font-bold text-green-700 mt-3">
            {appointments.filter(a => a.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-300">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-700 font-bold text-xl">Chưa có lịch chăm sóc</p>
            <p className="text-gray-600 text-lg mt-2 font-medium">Hãy đặt một buổi chăm sóc ngay</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Appointment Card Header */}
              <button
                onClick={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={32} className="text-teal-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{appointment.caregiver}</h3>
                    <p className="text-base text-gray-700 font-medium">{appointment.service}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-lg text-gray-900">{appointment.date}</p>
                    <p className="text-base text-gray-700 font-medium flex items-center gap-1 justify-end">
                      <Clock size={16} />
                      {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(appointment.status)}
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      expandedId === appointment.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === appointment.id && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex gap-3">
                      <MapPin size={22} className="text-teal-600 flex-shrink-0 mt-0.5 font-bold" />
                      <div>
                        <p className="text-base text-gray-700 font-bold">Địa chỉ</p>
                        <p className="text-gray-900 text-base font-medium">{appointment.address}</p>
                      </div>
                    </div>

                    {/* Rating Section - Only show for completed appointments */}
                    {appointment.status === 'completed' && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-base text-gray-700 font-bold mb-3">Đánh giá buổi chăm sóc</p>
                        {appointment.rating ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={28}
                                  className={`cursor-pointer transition-colors ${
                                    star <= appointment.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-lg text-gray-700 ml-2 font-bold">{appointment.rating}/5</span>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRating(appointment.id, star)}
                                className="transition-colors"
                              >
                                <Star
                                  size={28}
                                  className="text-gray-300 hover:text-yellow-400 cursor-pointer"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 pt-4 flex gap-3">
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600  rounded-lg hover:bg-red-700 transition-colors font-bold text-base"
                        >
                          <X size={18} />
                          Hủy buổi
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenChat(appointment.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-bold text-base ${
                          openChatIds.has(appointment.id)
                            ? 'bg-blue-700 '
                            : 'bg-blue-600  hover:bg-blue-700'
                        }`}
                      >
                        <MessageCircle size={18} />
                        {openChatIds.has(appointment.id) ? 'Đóng chat' : 'Chat'}
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600  rounded-lg hover:bg-teal-700 transition-colors font-bold text-base">
                        <Check size={18} />
                        Chi tiết
                      </button>
                    </div>

                    {/* Chat Window - Inline */}
                    {openChatIds.has(appointment.id) && chatRooms[appointment.id] && user && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="bg-gray-100 rounded-lg overflow-hidden">
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
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Booking Button */}
      <div className="flex justify-end">
        <button className="px-8 py-4 bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-bold text-lg flex items-center gap-2  shadow-lg">
          <Calendar size={24} />
          Đặt buổi chăm sóc mới
        </button>
      </div>
    </div>
  );
};

export default ScheduledCare;