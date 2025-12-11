import { MapPin, Calendar, Clock, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const BookingDetails = ({ chatRoom }) => {
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    try {
      return format(new Date(dateTime), 'HH:mm - dd/MM/yyyy', { locale: vi });
    } catch {
      return '-';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REJECTED: 'bg-red-100 text-red-800',
      ASSIGNED: 'bg-indigo-100 text-indigo-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-3 max-h-48 overflow-y-auto">
      {/* Service */}
      <div className="flex items-start gap-3">
        <Briefcase size={16} className="text-primary-600 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600">Dịch vụ</p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {chatRoom.serviceName || '-'}
          </p>
        </div>
      </div>

      {/* Scheduled Time */}
      <div className="flex items-start gap-3">
        <Calendar size={16} className="text-primary-600 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600">Thời gian dự kiến</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatDateTime(chatRoom.scheduledStartTime)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            đến {formatDateTime(chatRoom.scheduledEndTime)}
          </p>
        </div>
      </div>

      {/* Location */}
      {chatRoom.location && (
        <div className="flex items-start gap-3">
          <MapPin size={16} className="text-primary-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600">Địa điểm</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {chatRoom.location}
            </p>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-1">Trạng thái</p>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(chatRoom.bookingStatus)}`}>
            {chatRoom.bookingStatus === 'PENDING' && 'Chờ xác nhận'}
            {chatRoom.bookingStatus === 'CONFIRMED' && 'Đã xác nhận'}
            {chatRoom.bookingStatus === 'ASSIGNED' && 'Đã giao cho carer'}
            {chatRoom.bookingStatus === 'IN_PROGRESS' && 'Đang thực hiện'}
            {chatRoom.bookingStatus === 'COMPLETED' && 'Hoàn thành'}
            {chatRoom.bookingStatus === 'CANCELLED' && 'Đã hủy'}
            {chatRoom.bookingStatus === 'REJECTED' && 'Đã từ chối'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
