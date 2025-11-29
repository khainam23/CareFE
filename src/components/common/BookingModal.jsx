import { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, Briefcase, MapPin, Plus } from 'lucide-react';
import Button from './Button/Button';
import DatePickerInput from '@/components/DatePickerInput';
import { publicService } from '@/services/publicService';
import { customerService } from '@/services/customerService';

function BookingModal({ isOpen, onClose, caregiver, onSubmit }) {
  const [formData, setFormData] = useState({
    serviceId: '',
    customService: '',
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '17:00',
    location: '',
    addressId: '',
    notes: '',
  });
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showNewAddressInput, setShowNewAddressInput] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', label: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const response = await publicService.getServices();
      if (response.success && response.data) {
        setServices(response.data);
        // Set default service if available
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, serviceId: response.data[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await customerService.getAddresses();
      if (response.success && response.data) {
        setAddresses(response.data);
        // Set default address if available
        const defaultAddr = response.data.find(addr => addr.isDefault);
        if (defaultAddr) {
          setFormData(prev => ({ 
            ...prev, 
            addressId: defaultAddr.id,
            location: defaultAddr.address 
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const handleAddressChange = (e) => {
    const addressId = e.target.value;
    if (addressId === 'new') {
      setShowNewAddressInput(true);
      setFormData(prev => ({ ...prev, addressId: '', location: '' }));
    } else if (addressId) {
      const selectedAddress = addresses.find(addr => addr.id === parseInt(addressId));
      setShowNewAddressInput(false);
      setFormData(prev => ({ 
        ...prev, 
        addressId: addressId,
        location: selectedAddress?.address || '' 
      }));
    }
    setError('');
  };

  const handleSaveNewAddress = async () => {
    if (!newAddress.address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      return;
    }

    try {
      const response = await customerService.createAddress({
        address: newAddress.address,
        label: newAddress.label || null,
        isDefault: addresses.length === 0
      });

      if (response.success && response.data) {
        setAddresses(prev => [...prev, response.data]);
        setFormData(prev => ({ 
          ...prev, 
          addressId: response.data.id,
          location: response.data.address 
        }));
        setShowNewAddressInput(false);
        setNewAddress({ address: '', label: '' });
      }
    } catch (err) {
      setError(err?.message || 'Không thể lưu địa chỉ');
    }
  };

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
  const subtotal = totalHours * (caregiver?.hourlyRate || 0);
  const TAX_RATE = 0.15; // 15% tax
  const taxAmount = subtotal * TAX_RATE;
  const totalPrice = subtotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.serviceId) {
      setError('Vui lòng chọn loại dịch vụ');
      return;
    }

    if (!formData.location || formData.location.trim() === '') {
      setError('Vui lòng nhập địa chỉ dịch vụ');
      return;
    }

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
        serviceId: formData.serviceId,
        caregiverId: caregiver.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        notes: formData.notes,
        totalHours,
        subtotal,
        taxAmount,
        totalPrice,
      });
      
      // Reset form
      setFormData({
        serviceId: services.length > 0 ? services[0].id : '',
        customService: '',
        startDate: '',
        endDate: '',
        startTime: '08:00',
        endTime: '17:00',
        location: '',
        addressId: '',
        notes: '',
      });
      setShowNewAddressInput(false);
      setNewAddress({ address: '', label: '' });
      onClose();
    } catch (err) {
      setError(err?.message || err?.error || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = new Date();
  const minEndDate = formData.startDate ? new Date(formData.startDate) : today;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" style={{ background: "rgba(0,0,0,0.4)"}}>
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
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="inline mr-1" />
                Loại dịch vụ
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.basePrice?.toLocaleString()}đ ({service.durationMinutes} phút)
                  </option>
                ))}
              </select>
              {formData.serviceId && services.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {services.find(s => s.id === parseInt(formData.serviceId))?.description}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Ngày bắt đầu
                </label>
                <DatePickerInput
                  value={formData.startDate}
                  onChange={(value) =>
                    handleChange({ target: { name: 'startDate', value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  minDate={today}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Ngày kết thúc
                </label>
                <DatePickerInput
                  value={formData.endDate}
                  onChange={(value) =>
                    handleChange({ target: { name: 'endDate', value } })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  minDate={minEndDate}
                  disabled={loading}
                  required
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

            {/* Address Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Địa chỉ dịch vụ *
              </label>
              <select
                value={formData.addressId}
                onChange={handleAddressChange}
                required={!showNewAddressInput}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn địa chỉ --</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label ? `${addr.label} - ${addr.address}` : addr.address}
                    {addr.isDefault ? ' (Mặc định)' : ''}
                  </option>
                ))}
                <option value="new">+ Thêm địa chỉ mới</option>
              </select>

              {/* New Address Input */}
              {showNewAddressInput && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Nhập địa chỉ mới..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Nhãn (VD: Nhà riêng, Văn phòng...)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleSaveNewAddress}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      <Plus size={16} className="inline mr-1" />
                      Lưu địa chỉ
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowNewAddressInput(false);
                        setNewAddress({ address: '', label: '' });
                      }}
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Thuế (15%):</span>
                  <span className="font-semibold text-gray-900">
                    {taxAmount.toLocaleString()}đ
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
