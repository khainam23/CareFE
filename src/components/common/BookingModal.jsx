import { useState } from 'react';
import { X, Calendar, Clock, DollarSign } from 'lucide-react';
import Button from './Button/Button';

function BookingModal({ isOpen, onClose, caregiver, onSubmit }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '17:00',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const calculateTotalHours = () => {
    if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      return 0;
    }

    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours > 0 ? diffHours : 0;
  };

  const totalHours = calculateTotalHours();
  const totalPrice = totalHours * (caregiver?.hourlyRate || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.startDate || !formData.endDate) {
      setError('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);

    if (start >= end) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    if (start < new Date()) {
      setError('Không thể đặt lịch trong quá khứ');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        caregiverId: caregiver.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
        totalHours,
        totalPrice,
      });
      
      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        startTime: '08:00',
        endTime: '17:00',
        notes: '',
      });
      onClose();
    } catch (err) {
      setError(err?.message || err?.error || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Đặt lịch dịch vụ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Caregiver Info */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{caregiver?.fullName}</h3>
              <p className="text-sm text-gray-600">{caregiver?.caregiverType}</p>
              <p className="text-teal-600 font-semibold mt-1">
                {(caregiver?.hourlyRate || 0).toLocaleString()}đ / giờ
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Giờ kết thúc
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Thêm ghi chú về yêu cầu đặc biệt..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Price Summary */}
            {totalHours > 0 && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Tổng số giờ:</span>
                  <span className="font-semibold text-gray-900">{totalHours.toFixed(1)} giờ</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Giá / giờ:</span>
                  <span className="font-semibold text-gray-900">
                    {(caregiver?.hourlyRate || 0).toLocaleString()}đ
                  </span>
                </div>
                <div className="border-t border-teal-300 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      <DollarSign size={20} className="inline mr-1" />
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      {totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading || totalHours <= 0}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
