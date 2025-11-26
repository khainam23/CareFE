import { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import Button from '@/components/common/Button/Button';
import { customerService } from '@/services/customerService';
import Swal from 'sweetalert2';

function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ address: '', label: '' });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAddresses();
      if (response.success && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách địa chỉ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.address.trim()) {
      Swal.fire('Lỗi', 'Vui lòng nhập địa chỉ', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await customerService.createAddress({
        address: newAddress.address,
        label: newAddress.label || null,
        isDefault: addresses.length === 0
      });

      if (response.success && response.data) {
        setAddresses(prev => [...prev, response.data]);
        setNewAddress({ address: '', label: '' });
        setShowAddForm(false);
        Swal.fire('Thành công', 'Đã thêm địa chỉ mới', 'success');
      }
    } catch (error) {
      Swal.fire('Lỗi', error?.message || 'Không thể thêm địa chỉ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setLoading(true);
      const response = await customerService.setDefaultAddress(addressId);
      if (response.success) {
        // Update local state
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })));
        Swal.fire('Thành công', 'Đã đặt địa chỉ mặc định', 'success');
      }
    } catch (error) {
      Swal.fire('Lỗi', error?.message || 'Không thể đặt địa chỉ mặc định', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc muốn xóa địa chỉ này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await customerService.deleteAddress(addressId);
        if (response.success) {
          setAddresses(prev => prev.filter(addr => addr.id !== addressId));
          Swal.fire('Đã xóa', 'Địa chỉ đã được xóa', 'success');
        }
      } catch (error) {
        Swal.fire('Lỗi', error?.message || 'Không thể xóa địa chỉ', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          <MapPin className="inline mr-2" size={24} />
          Địa chỉ của tôi
        </h2>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
            size="sm"
          >
            <Plus size={16} className="inline mr-1" />
            Thêm địa chỉ
          </Button>
        )}
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Thêm địa chỉ mới</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newAddress.address}
              onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Địa chỉ *"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              value={newAddress.label}
              onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Nhãn (VD: Nhà riêng, Văn phòng...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddAddress}
                variant="primary"
                size="sm"
                disabled={loading}
                className="flex-1"
              >
                Lưu
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAddress({ address: '', label: '' });
                }}
                variant="secondary"
                size="sm"
                disabled={loading}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Address List */}
      {loading && addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có địa chỉ nào. Thêm địa chỉ đầu tiên của bạn!
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg ${
                address.isDefault
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {address.label && (
                      <span className="font-semibold text-gray-900">
                        {address.label}
                      </span>
                    )}
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        <Star size={12} className="mr-1 fill-current" />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{address.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Thêm lúc: {new Date(address.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={loading}
                      className="text-teal-600 hover:text-teal-700 p-2 rounded-lg hover:bg-teal-50 transition-colors"
                      title="Đặt làm mặc định"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressManager;
