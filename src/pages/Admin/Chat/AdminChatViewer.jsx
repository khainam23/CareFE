import { useState, useEffect } from 'react';
import { Search, MessageCircle, AlertTriangle, Clock, User } from 'lucide-react';
import axiosInstance from '@/api/axiosConfig';
import { formatDistanceToNow } from 'date-fns';

const AdminChatViewer = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/chat/rooms');
      setChatRooms(response.data.data || []);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      setMessagesLoading(true);
      const response = await axiosInstance.get(`/api/admin/chat/rooms/${roomId}/messages`, {
        params: { page: 0, size: 100 }
      });
      setMessages(response.data.data?.content || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    loadMessages(room.id);
  };

  const filteredRooms = chatRooms.filter(room => {
    const matchesSearch = searchTerm === '' || 
      room.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.caregiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.bookingId?.toString().includes(searchTerm);

    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Viewer</h1>
          <p className="text-gray-600">View and monitor all chat conversations (Read-only)</p>
        </div>

        {/* Privacy Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-400 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Privacy Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You are accessing private conversations between customers and caregivers. 
                This access is logged for audit purposes. Please respect user privacy and only 
                access conversations when necessary for support or moderation purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Rooms List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat Rooms</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Rooms List */}
            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No chat rooms found</p>
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room)}
                    className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      selectedRoom?.id === room.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {room.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">
                            {room.caregiverName}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        room.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      Booking #{room.bookingId}
                    </div>
                    {room.lastMessageAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Clock size={12} />
                        <span>{formatTime(room.lastMessageAt)}</span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedRoom ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Chat History - Booking #{selectedRoom.bookingId}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>Customer: <span className="font-medium">{selectedRoom.customerName}</span></div>
                    <div>Caregiver: <span className="font-medium">{selectedRoom.caregiverName}</span></div>
                  </div>
                </div>

                {/* Messages */}
                <div className="overflow-y-auto max-h-[600px] p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                      <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No messages in this conversation</p>
                    </div>
                  ) : (
                    messages.reverse().map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'CUSTOMER' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.senderType === 'CUSTOMER' 
                            ? 'bg-gray-100' 
                            : 'bg-primary-100'
                        } rounded-lg p-3`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-700">
                              {message.senderName}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({message.senderType})
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.createdAt)}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              message.status === 'READ' 
                                ? 'bg-green-100 text-green-800' 
                                : message.status === 'DELIVERED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {message.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Read-only Notice */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertTriangle size={16} />
                    <span>This is a read-only view. You cannot send messages.</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-gray-500">
                <div className="text-center">
                  <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a chat room to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatViewer;
