import React, { useState } from 'react';
import { AlertCircle, Trash2, LogOut, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Đăng xuất',
      text: 'Bạn có chắc chắn muốn đăng xuất?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Xóa tài khoản',
      text: 'Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
      icon: 'warning',
      input: 'text',
      inputLabel: 'Nhập email của bạn để xác nhận',
      inputPlaceholder: 'email@example.com',
      showCancelButton: true,
      confirmButtonText: 'Xóa tài khoản',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Vui lòng nhập email để xác nhận';
        }
      }
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await Swal.fire('Thành công', 'Tài khoản của bạn đã được xóa', 'success');
        logout();
        navigate('/');
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xóa tài khoản', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">Quản lý tài khoản</h3>
          <p className="text-sm text-blue-700">Quản lý hoạt động tài khoản của bạn</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <LogOut className="w-5 h-5 text-gray-600" />
                Đăng xuất
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Đăng xuất khỏi tài khoản của bạn trên thiết bị này
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-red-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Xóa tài khoản
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Xóa
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Lưu ý:</strong> Sau khi xóa tài khoản, bạn sẽ mất quyền truy cập vào tất cả các dịch vụ và dữ liệu liên quan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
