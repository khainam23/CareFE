import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus, Filter, Search } from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for tasks
  const tasks = {
    all: [
      {
        id: 1,
        customerName: 'Bà Nguyễn Thị A',
        taskType: 'Chăm sóc cá nhân',
        description: 'Tắm và giúp mặc quần áo',
        dueDate: '15/01/2025',
        dueTime: '09:00',
        priority: 'Cao',
        status: 'Chưa hoàn thành',
      },
      {
        id: 2,
        customerName: 'Ông Trần Văn B',
        taskType: 'Hỗ trợ y tế',
        description: 'Đo huyết áp và ghi chép kết quả',
        dueDate: '15/01/2025',
        dueTime: '14:00',
        priority: 'Trung bình',
        status: 'Chưa hoàn thành',
      },
      {
        id: 3,
        customerName: 'Chị Lê Thị C',
        taskType: 'Chăm sóc cá nhân',
        description: 'Rửa mặt và chải tóc',
        dueDate: '14/01/2025',
        dueTime: '10:00',
        priority: 'Thấp',
        status: 'Đã hoàn thành',
      },
      {
        id: 4,
        customerName: 'Cô Phạm Thị D',
        taskType: 'Trợ cấp sinh hoạt',
        description: 'Giúp lau dọn phòng',
        dueDate: '16/01/2025',
        dueTime: '11:00',
        priority: 'Trung bình',
        status: 'Chưa hoàn thành',
      },
      {
        id: 5,
        customerName: 'Ông Hoàng Văn E',
        taskType: 'Hỗ trợ y tế',
        description: 'Chuẩn bị thuốc và uống thuốc đúng giờ',
        dueDate: '13/01/2025',
        dueTime: '08:00',
        priority: 'Cao',
        status: 'Đã hoàn thành',
      },
    ],
  };

  // Filter tasks based on status
  const getFilteredTasks = () => {
    let filtered = tasks.all;

    if (activeTab === 'pending') {
      filtered = filtered.filter(task => task.status === 'Chưa hoàn thành');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(task => task.status === 'Đã hoàn thành');
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusColor = (status) => {
    if (status === 'Đã hoàn thành') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-yellow-100 text-yellow-700';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Cao':
        return 'bg-red-100 text-red-700';
      case 'Trung bình':
        return 'bg-orange-100 text-orange-700';
      case 'Thấp':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Tổng nhiệm vụ</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">{tasks.all.length}</span>
            </div>
            <CheckCircle2 size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Chưa hoàn thành</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">
                {tasks.all.filter(t => t.status === 'Chưa hoàn thành').length}
              </span>
            </div>
            <Clock size={32} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Đã hoàn thành</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">
                {tasks.all.filter(t => t.status === 'Đã hoàn thành').length}
              </span>
            </div>
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bệnh nhân, loại nhiệm vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-500 text-teal-500 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
            <Filter size={18} />
            Lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors">
            <Plus size={18} />
            Thêm nhiệm vụ
          </button>
        </div>
      </div>

      {/* Tabs for filtering */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tất cả ({tasks.all.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Chưa hoàn thành ({tasks.all.filter(t => t.status === 'Chưa hoàn thành').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'completed'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đã hoàn thành ({tasks.all.filter(t => t.status === 'Đã hoàn thành').length})
          </button>
        </div>

        {/* Task List */}
        <div className="p-6 space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{task.customerName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.taskType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {/* Task Description */}
                <div className="mb-4 p-3 bg-gray-50 rounded border-l-4 border-teal-500">
                  <p className="text-sm text-gray-900">{task.description}</p>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Ngày hạn</span>
                    <p className="text-sm text-gray-900 font-medium">{task.dueDate}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Giờ hạn</span>
                    <p className="text-sm text-gray-900 font-medium">{task.dueTime}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Mức độ ưu tiên</span>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Trạng thái</span>
                    <p className="text-sm text-gray-900 font-medium">{task.status}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {task.status === 'Chưa hoàn thành' && (
                    <>
                      <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm">
                        Hoàn thành
                      </button>
                      <button className="bg-white border-2 border-gray-300 text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                        Chỉnh sửa
                      </button>
                    </>
                  )}
                  <button className="bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-sm">
                    Chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Không tìm thấy nhiệm vụ nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;