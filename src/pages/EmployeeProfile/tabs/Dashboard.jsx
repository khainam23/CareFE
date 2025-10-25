import { Clock, Users, Calendar, User } from 'lucide-react';
import CardBg from '@/assets/images/Card.svg';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Thu nhập cá nhân */}
      <div className="lg:col-span-6 md:col-span-6">
        <div 
          className="rounded-lg shadow-md p-6 text-white relative overflow-hidden"
          style={{ backgroundImage: `url(${CardBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <span className="text-sm font-medium opacity-90">Số tiền thu nhập tháng này</span>
            <span className="block text-3xl font-bold mt-2">4.000.000 đ</span>
            <span className="block text-sm font-medium mt-4 text-green-100">↑ Tăng 12% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Số giờ làm trong tuần này */}
      <div className="lg:col-span-3 md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Số giờ làm tuần này</span>
            <Clock size={24} className="text-orange-500" />
          </div>
          <span className="block text-3xl font-bold text-gray-900">36</span>
          <span className="block text-xs text-gray-500 mt-2">giờ</span>
        </div>
      </div>

      {/* Số ca chăm sóc hôm nay */}
      <div className="lg:col-span-3 md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Số ca chăm sóc hôm nay</span>
            <Users size={24} className="text-green-500" />
          </div>
          <span className="block text-3xl font-bold text-gray-900">3</span>
          <span className="block text-xs text-gray-500 mt-2">ca</span>
        </div>
      </div>

      {/* Cuộc hẹn sắp tới */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-red-500" />
            <span className="text-sm font-medium text-gray-600">Cuộc hẹn sắp tới</span>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="block font-medium text-gray-900">Bà Nguyễn Thị A</span>
              <span className="block text-xs text-gray-500">Hôm nay, 14:00</span>
            </div>
            <div className="text-sm">
              <span className="block font-medium text-gray-900">Ông Trần Văn B</span>
              <span className="block text-xs text-gray-500">Ngày mai, 10:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bệnh nhân gần đây */}
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Bệnh nhân gần đây</span>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="block font-medium text-gray-900">Chị Lê Thị C</span>
              <span className="block text-xs text-gray-500">Chăm sóc hôm qua</span>
            </div>
            <div className="text-sm">
              <span className="block font-medium text-gray-900">Cô Phạm Thị D</span>
              <span className="block text-xs text-gray-500">Chăm sóc 2 ngày trước</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
