import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Lock, Unlock } from 'lucide-react';
import axiosInstance from '@api/axiosConfig';
import Swal from 'sweetalert2';
import { useAuthStore } from '@store/authStore';

const CustomersList = () => {
  const { hasRole } = useAuthStore();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/users');
      console.log('Fetch customers response:', response.data);
      if (response.data.success) {
        // Backend trả về Page object với content array
        const usersData = response.data.data?.content || response.data.data || [];
        const users = Array.isArray(usersData) ? usersData : [];
        console.log('Total users:', users.length);
        // Backend trả về roles là array, check nếu có ROLE_CUSTOMER
        const customerUsers = users.filter((user) => 
          user.roles && user.roles.some(role => 
            role === 'CUSTOMER' || role === 'ROLE_CUSTOMER'
          )
        );
        console.log('Filtered customers:', customerUsers.length);
        setCustomers(customerUsers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (userId, isActive) => {
    const action = isActive ? 'khóa' : 'mở khóa';
    const result = await Swal.fire({
      title: `Xác nhận ${action} tài khoản?`,
      text: `Bạn có chắc muốn ${action} tài khoản này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#ef4444' : '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Đồng ý ${action}`,
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const endpoint = isActive ? `/api/admin/users/${userId}/lock` : `/api/admin/users/${userId}/unlock`;
        const response = await axiosInstance.put(endpoint);
        if (response.data.success) {
          Swal.fire('Thành công', `Đã ${action} tài khoản`, 'success');
          fetchCustomers();
        }
      } catch (error) {
        console.error(`Failed to ${action} user:`, error);
        Swal.fire('Lỗi', `Không thể ${action} tài khoản`, 'error');
      }
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber?.includes(searchTerm)
  );

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
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Quản lý Customers</h1>
        <p className="text-chilled-gray-500">Xem và quản lý tất cả khách hàng trong hệ thống</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chilled-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-chilled-gray-500">
            Không tìm thấy khách hàng nào
          </div>
        ) : (
          filteredCustomers.map((customer) => {
            const isActive = customer.status === 'ACTIVE';
            return (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{customer.fullName}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </div>
                  </div>
                </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-chilled-gray-600">
                  <Mail size={16} />
                  <span>{customer.email}</span>
                </div>
                {customer.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-chilled-gray-600">
                    <Phone size={16} />
                    <span>{customer.phoneNumber}</span>
                  </div>
                )}
              </div>

              {hasRole('ADMIN') && (
                <div className="pt-4 border-t border-chilled-gray-200">
                  <button
                    onClick={() => handleToggleLock(customer.id, isActive)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Lock size={16} />
                        Khóa tài khoản
                      </>
                    ) : (
                      <>
                        <Unlock size={16} />
                        Mở khóa
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Tổng khách hàng</div>
          <div className="text-2xl font-bold text-charcoal-900">{customers.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Đang hoạt động</div>
          <div className="text-2xl font-bold text-green-600">
            {customers.filter((c) => c.status === 'ACTIVE').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Đã khóa</div>
          <div className="text-2xl font-bold text-red-600">
            {customers.filter((c) => c.status !== 'ACTIVE').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersList;
