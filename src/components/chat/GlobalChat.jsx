import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';
import chatService from '@/services/chatService';
import { useAuthStore } from '@/store/authStore';

const GlobalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Initial load of unread count
    loadUnreadCount();

    // Subscribe to global message events to update unread count
    // This assumes chatService emits events or we poll
    const interval = setInterval(loadUnreadCount, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const response = await chatService.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Failed to load unread count', error);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseChat = () => {
    setSelectedRoom(null);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window or List */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-2xl w-96 h-[600px] overflow-hidden flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 p-4 flex items-center justify-between  shrink-0">
            <h3 className="font-semibold text-lg">
              {selectedRoom ? (selectedRoom.customerName === user.fullName ? selectedRoom.caregiverName : selectedRoom.customerName) : 'Tin nhắn'}
            </h3>
            <button 
              onClick={() => {
                if (selectedRoom) {
                  setSelectedRoom(null);
                } else {
                  setIsOpen(false);
                }
              }}
              className="hover:bg-primary-700 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            {selectedRoom ? (
              <ChatWindow
                chatRoom={selectedRoom}
                onClose={handleCloseChat}
                currentUserId={user.id}
                inline={true}
              />
            ) : (
              <div className="h-full overflow-y-auto">
                <ChatRoomList onSelectRoom={handleRoomSelect} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600  p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform hover:scale-105 relative"
        >
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500  text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default GlobalChat;
