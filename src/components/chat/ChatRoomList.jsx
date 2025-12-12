import { useState, useEffect } from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import chatService from '@/services/chatService';
import ChatWindow from './ChatWindow';
import ChatErrorBoundary from './ChatErrorBoundary';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';

const ChatRoomList = ({ onSelectRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadChatRooms();
  }, []);

  const loadChatRooms = async () => {
    try {
      setLoading(true);
      const response = await chatService.getChatRooms();
      setChatRooms(response.data || []);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    if (onSelectRoom) {
      onSelectRoom(room);
    } else {
      setSelectedRoom(room);
    }
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p>No active chats yet</p>
        <p className="text-sm mt-2">Chats will appear here when you have confirmed bookings</p>
      </div>
    );
  }

  return (
    <ChatErrorBoundary
      errorMessage="Failed to load chat rooms. Please try again."
      onReset={loadChatRooms}
    >
      <>
        <div className="space-y-2">
          {chatRooms.map((room) => {
            const isCustomer = room.customerId === user?.id;
            const otherUserName = isCustomer ? room.caregiverName : room.customerName;
            
            return (
              <button
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="w-full text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {otherUserName}
                      </h3>
                      {room.unreadCount > 0 && (
                        <span className="bg-red-500  text-xs font-bold rounded-full px-2 py-0.5">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {room.lastMessagePreview || 'No messages yet'}
                    </p>
                    {room.lastMessageAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock size={12} />
                        <span>{formatLastMessageTime(room.lastMessageAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {!onSelectRoom && selectedRoom && (
          <ChatWindow
            chatRoom={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            currentUserId={user?.id}
          />
        )}
      </>
    </ChatErrorBoundary>
  );
};

export default ChatRoomList;
