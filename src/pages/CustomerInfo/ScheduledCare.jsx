import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Star, Check, X, ChevronDown, Loader2 } from 'lucide-react';
import { customerService } from '@/services/customerService';
import Swal from 'sweetalert2';

const ScheduledCare = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Xác nhận' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn thành' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Hủy' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
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
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Không thể tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2 bg-teal-500  rounded-lg hover:bg-teal-600 transition-colors"
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
        <h2 className="text-2xl font-bold text-gray-800">Lịch chăm sóc đã đặt</h2>
        <p className="text-gray-600 mt-2">Quản lý các buổi chăm sóc của bạn</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Tổng buổi</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{appointments.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Chờ xác nhận</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {appointments.filter(a => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Đã xác nhận</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {appointments.filter(a => a.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Hoàn thành</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {appointments.filter(a => a.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium">Chưa có lịch chăm sóc</p>
            <p className="text-gray-500 text-sm mt-2">Hãy đặt một buổi chăm sóc ngay</p>
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
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{appointment.caregiver}</h3>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-medium text-gray-800">{appointment.date}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                      <Clock size={14} />
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
                      <MapPin size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Địa chỉ</p>
                        <p className="text-gray-800">{appointment.address}</p>
                      </div>
                    </div>

                    {/* Rating Section - Only show for completed appointments */}
                    {appointment.status === 'completed' && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600 font-medium mb-3">Đánh giá buổi chăm sóc</p>
                        {appointment.rating ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={20}
                                  className={`cursor-pointer transition-colors ${
                                    star <= appointment.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">{appointment.rating}/5</span>
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
                                  size={20}
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
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                          <X size={16} />
                          Hủy buổi
                        </button>
                      )}
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors font-medium">
                        <Check size={16} />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Booking Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-teal-500  rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center gap-2">
          <Calendar size={18} />
          Đặt buổi chăm sóc mới
        </button>
      </div>
    </div>
  );
};

export default ScheduledCare;