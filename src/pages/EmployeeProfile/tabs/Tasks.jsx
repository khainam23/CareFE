import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import { caregiverService } from '@/services/caregiverService';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  const closeDetailsModal = () => {
    setSelectedTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await caregiverService.getBookings();
      if (response.success) {
        const mappedTasks = response.data.map(booking => ({
          id: booking.id,
          customerName: booking.customerName,
          taskType: booking.serviceName || 'Chăm sóc',
          description: booking.customerNote || 'Không có ghi chú',
          dueDate: booking.scheduledStartTime,
          dueTime: booking.scheduledStartTime,
          priority: getPriority(booking.scheduledStartTime),
          status: mapStatus(booking.status),
          bookingStatus: booking.status,
        }));
        setTasks(mappedTasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (bookingStatus) => {
    if (bookingStatus === 'COMPLETED') return 'Đã hoàn thành';
    return 'Chưa hoàn thành';
  };

  const getPriority = (dateTime) => {
    const now = new Date();
    const scheduled = new Date(dateTime);
    const hoursDiff = (scheduled - now) / (1000 * 60 * 60);
    
    if (hoursDiff < 2) return 'Cao';
    if (hoursDiff < 24) return 'Trung bình';
    return 'Thấp';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleComplete = async (taskId) => {
    try {
      await caregiverService.completeBooking(taskId);
      fetchTasks();
    } catch (err) {
      alert('Không thể hoàn thành nhiệm vụ');
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

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
              <span className="block text-3xl font-bold text-gray-900 mt-2">{tasks.length}</span>
            </div>
            <CheckCircle2 size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Chưa hoàn thành</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">
                {tasks.filter(t => t.status === 'Chưa hoàn thành').length}
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
                {tasks.filter(t => t.status === 'Đã hoàn thành').length}
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
          <button 
            onClick={fetchTasks}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500  rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            <Plus size={18} />
            Làm mới
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
            Tất cả ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Chưa hoàn thành ({tasks.filter(t => t.status === 'Chưa hoàn thành').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === 'completed'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đã hoàn thành ({tasks.filter(t => t.status === 'Đã hoàn thành').length})
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
                    <p className="text-sm text-gray-900 font-medium">{formatDate(task.dueDate)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Giờ hạn</span>
                    <p className="text-sm text-gray-900 font-medium">{formatTime(task.dueTime)}</p>
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
                  {task.status === 'Chưa hoàn thành' && task.bookingStatus === 'ACCEPTED' && (
                    <button 
                      onClick={() => handleComplete(task.id)}
                      className="bg-green-500  py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                    >
                      Hoàn thành
                    </button>
                  )}
                  <button 
                    onClick={() => handleViewDetails(task)}
                    className="bg-white border-2 border-teal-500 text-teal-500 py-2 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors text-sm"
                  >
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

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-teal-600 p-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold">Chi tiết nhiệm vụ</h3>
              <button onClick={closeDetailsModal} className="hover:bg-teal-700 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Task Header */}
              <div className="pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Loại nhiệm vụ</p>
                <p className="text-lg font-semibold text-gray-900">{selectedTask.taskType}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    Ưu tiên: {selectedTask.priority}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Khách hàng</p>
                <p className="font-medium text-gray-900">{selectedTask.customerName}</p>
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Mô tả / Ghi chú</p>
                <p className="text-gray-800">{selectedTask.description}</p>
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ngày hạn</p>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span className="font-medium">{formatDate(selectedTask.dueDate)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Giờ hạn</p>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span className="font-medium">{formatTime(selectedTask.dueTime)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              {selectedTask.status === 'Chưa hoàn thành' && selectedTask.bookingStatus === 'ACCEPTED' ? (
                <button 
                  onClick={() => {
                    handleComplete(selectedTask.id);
                    closeDetailsModal();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Hoàn thành nhiệm vụ
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;