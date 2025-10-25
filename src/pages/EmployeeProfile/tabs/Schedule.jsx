import { useState } from 'react';
import Rectangle131 from '@/assets/images/Rectangle 131.svg';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data for fixed schedule
  const fixedSchedule = [
    { day: 'Thứ 2', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 3', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 4', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 5', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 6', hours: '08:00 - 17:00', status: 'Hoạt động' },
    { day: 'Thứ 7', hours: 'Nghỉ', status: 'Ngày nghỉ' },
    { day: 'Chủ nhật', hours: 'Nghỉ', status: 'Ngày nghỉ' },
  ];

  // Mock data for appointments
  const appointments = {
    pending: [
      {
        id: 1,
        customerName: 'Bà Nguyễn Thị A',
        date: '15/01/2025',
        time: '14:00 - 16:00',
        hospital: 'Bệnh viện Quốc tế',
        notes: 'Chăm sóc sau phẫu thuật',
        price: '500,000 đ',
      },
      {
        id: 2,
        customerName: 'Ông Trần Văn B',
        date: '16/01/2025',
        time: '09:00 - 11:00',
        hospital: 'Bệnh viện Hữu nghị',
        notes: 'Chăm sóc bệnh nhân cao tuổi',
        price: '400,000 đ',
      },
    ],
    approved: [
      {
        id: 3,
        customerName: 'Chị Lê Thị C',
        date: '14/01/2025',
        time: '10:00 - 12:00',
        hospital: 'Bệnh viện Nhi đồng',
        notes: 'Chăm sóc hôm nay',
        price: '450,000 đ',
      },
    ],
    cancelled: [
      {
        id: 4,
        customerName: 'Cô Phạm Thị D',
        date: '13/01/2025',
        time: '15:00 - 17:00',
        hospital: 'Phòng khám đa khoa',
        notes: 'Đã hủy',
        price: '350,000 đ',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Lịch làm việc của nhân viên */}
      {/* Mục thông tin lịch làm việc cố định */}
      <div className="bg-white rounded-lg flex shadow-md overflow-hidden">
        <div
          className="relative bg-cover bg-center p-6 text-white"
          style={{ backgroundImage: `url(${Rectangle131})`, backgroundSize: 'cover' }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">Lịch làm việc cố định</h2>
            {/* Khoảng ngày làm việc */}
            <span className="block text-sm opacity-90 mb-1">Từ: 01/01/2025 - Đến: 31/12/2025</span>

            {/* Ngày hôm nay */}
            <span className="block text-sm opacity-90 mb-1">Hôm nay: 14/01/2025</span>

            {/* Giờ làm việc */}
            <span className="block text-sm font-semibold">Giờ làm việc: 40 giờ/tuần</span>
          </div>
        </div>

        {/* Các ngày trong tuần */}
        <div className="p-6 w-full">
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ngày</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Giờ</th>
                {/* Gồm: Hoạt động hôm nay, ngày nghỉ, hoạt động */}
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {fixedSchedule.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{item.day}</td>
                  <td className="py-3 px-4 text-gray-600">{item.hours}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'Hoạt động'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-3">
            <button className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-600 transition-colors">
              Đồng ý lịch làm
            </button>
            <button className="flex-1 bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
              Gửi yêu cầu thay đổi lịch
            </button>
          </div>
        </div>
      </div>

      {/* Các cuộc hẹn, hiển thị phân trang */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Yêu cầu đặt lịch
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'approved'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đơn đã đồng ý
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'cancelled'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đơn đã hủy
          </button>
        </div>

        <div className="p-6 space-y-4">
          {appointments[activeTab].map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{appointment.customerName}</h4>
              
              {/* Họ và tên */}
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-600">Họ và tên: </span>
                <span className="text-sm text-gray-900">{appointment.customerName}</span>
              </div>
              
              {/* Thời gian */}
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-600">Thời gian: </span>
                <span className="text-sm text-gray-900">{appointment.date}</span>
              </div>
              
              {/* Giờ */}
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-600">Giờ: </span>
                <span className="text-sm text-gray-900">{appointment.time}</span>
              </div>
              
              {/* Bệnh viện */}
              <div className="mb-2">
                <span className="text-sm font-semibold text-gray-600">Bệnh viện: </span>
                <span className="text-sm text-gray-900">{appointment.hospital}</span>
              </div>
              
              {/* Chú thích về bệnh nhân nếu có */}
              {appointment.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-teal-500">
                  <span className="text-sm font-semibold text-gray-600">Ghi chú: </span>
                  <span className="text-sm text-gray-900">{appointment.notes}</span>
                </div>
              )}

              <div className="flex gap-3 items-center">
                {/* Giá tiền */}
                <div className="flex-1">
                  <span className="text-lg font-bold text-teal-600">{appointment.price}</span>
                </div>
                
                {/* Hoạt động */}
                <div className="flex gap-2">
                  {activeTab === 'pending' && (
                    <>
                      <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm">
                        Xác nhận đơn
                      </button>
                      <button className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm">
                        Từ chối đơn
                      </button>
                    </>
                  )}
                  <button className="bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-sm">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
