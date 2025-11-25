import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, X, Loader2, Clock, FileText } from 'lucide-react';
import { customerService } from '@/services/customerService';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/helpers';
import DatePickerInput from '@/components/DatePickerInput';
import Swal from 'sweetalert2';

const PersonalProfile = () => {
  const { updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    notes: '',
  });

  const [editForm, setEditForm] = useState(profile);
  
  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  // Fetch profile data on mount
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để xem thông tin cá nhân');
      setLoading(false);
      return;
    }
    
    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getProfile();
      
      console.log('Profile response:', response);
      
      if (response.success && response.data) {
        const profileData = {
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          dateOfBirth: response.data.dateOfBirth || '',
          gender: response.data.gender || '',
          notes: response.data.notes || '',
        };
        setProfile(profileData);
        setEditForm(profileData);
      } else {
        // If API returns success: false, show error message
        const errorMsg = response.message || 'Không thể tải thông tin';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tải thông tin cá nhân';
      setError(errorMessage);
      
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải dữ liệu',
        html: `
          <p>${errorMessage}</p>
          <p class="text-sm text-gray-600 mt-2">Có thể do:</p>
          <ul class="text-sm text-left text-gray-600 mt-1">
            <li>• Backend chưa chạy</li>
            <li>• Token hết hạn</li>
            <li>• Không có quyền truy cập</li>
          </ul>
        `,
        confirmButtonText: 'Thử lại',
        showCancelButton: true,
        cancelButtonText: 'Đóng',
      }).then((result) => {
        if (result.isConfirmed) {
          fetchProfile();
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await customerService.updateProfile(editForm);
      
      if (response.success) {
        setProfile(editForm);
        setIsEditing(false);
        
        // Update user in auth store if name changed
        if (editForm.name !== profile.name) {
          updateUser({ name: editForm.name });
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật thông tin thành công',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể cập nhật thông tin',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value) => {
    setEditForm(prev => ({ ...prev, dateOfBirth: value }));
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError(null);
      const response = await customerService.getBookings();
      
      console.log('Bookings response:', response);
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setBookingsError(response.message || 'Không thể tải lịch chăm sóc');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingsError(error.message || 'Không thể tải lịch chăm sóc');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      IN_PROGRESS: { label: 'Đang thực hiện', color: 'bg-green-100 text-green-800' },
      COMPLETED: { label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
      CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    
    return statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:mm
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Error state - show error message with retry button
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Không thể tải thông tin</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
        {!isEditing && (
          <button
            onClick={handleEdit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 size={18} />
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Profile Avatar Section */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={48} className="text-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
          <p className="text-gray-600 mt-1">Khách hàng</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <User size={16} />
                Họ và tên
              </span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Mail size={16} />
                Email
              </span>
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Phone size={16} />
                Số điện thoại
              </span>
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.phone}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                Ngày sinh
              </span>
            </label>
            {isEditing ? (
              <DatePickerInput
                value={editForm.dateOfBirth}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {formatDate(profile.dateOfBirth)}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            {isEditing ? (
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.gender}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Địa chỉ
              </span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editForm.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium">
                {profile.address}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú y tế
          </label>
          {isEditing ? (
            <textarea
              name="notes"
              value={editForm.notes}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Thêm ghi chú về tình trạng sức khỏe, dị ứng hoặc yêu cầu đặc biệt..."
            />
          ) : (
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap">
              {profile.notes}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500  rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
              Hủy
            </button>
          </div>
        )}
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={24} className="text-teal-600" />
            Lịch chăm sóc đã đặt
          </h3>
          {!bookingsLoading && bookings.length > 0 && (
            <span className="text-sm text-gray-600">
              {bookings.length} lịch hẹn
            </span>
          )}
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-2" />
              <p className="text-gray-600">Đang tải lịch chăm sóc...</p>
            </div>
          </div>
        ) : bookingsError ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-600 mb-4">{bookingsError}</p>
            <button
              onClick={fetchBookings}
              className="px-6 py-2 bg-teal-500  rounded-lg hover:bg-teal-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Chưa có lịch chăm sóc nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusBadge = getStatusBadge(booking.status);
              return (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {booking.caregiverName || 'Người chăm sóc'}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Mã đặt lịch: #{booking.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-teal-600" />
                      <span className="text-sm">
                        <span className="font-medium">Ngày:</span> {formatDate(booking.startDate)}
                        {booking.endDate && booking.endDate !== booking.startDate && 
                          ` - ${formatDate(booking.endDate)}`
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-teal-600" />
                      <span className="text-sm">
                        <span className="font-medium">Giờ:</span> {formatTime(booking.startTime)}
                        {booking.endTime && ` - ${formatTime(booking.endTime)}`}
                      </span>
                    </div>

                    {booking.address && (
                      <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                        <MapPin size={16} className="text-teal-600" />
                        <span className="text-sm">
                          <span className="font-medium">Địa chỉ:</span> {booking.address}
                        </span>
                      </div>
                    )}

                    {booking.notes && (
                      <div className="flex items-start gap-2 text-gray-700 md:col-span-2">
                        <FileText size={16} className="text-teal-600 mt-0.5" />
                        <span className="text-sm">
                          <span className="font-medium">Ghi chú:</span> {booking.notes}
                        </span>
                      </div>
                    )}
                  </div>

                  {booking.totalPrice && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tổng chi phí:</span>
                        <span className="text-lg font-bold text-teal-600">
                          {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalProfile;