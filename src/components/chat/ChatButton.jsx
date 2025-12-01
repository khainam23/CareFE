import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';
import chatService from '@/services/chatService';
import { useAuthStore } from '@/store/authStore';

const ChatButton = ({ bookingId }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatRoom, setChatRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (bookingId) {
      loadChatRoom();
    }
  }, [bookingId]);

  const loadChatRoom = async () => {
    try {
      setLoading(true);
      const response = await chatService.getChatRoomByBooking(bookingId);
      setChatRoom(response.data);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error loading chat room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = () => {
    setShowChat(true);
    setUnreadCount(0);
  };

  if (!chatRoom || loading) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleOpenChat}
        className="relative bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <MessageCircle size={20} />
        <span>Chat</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showChat && (
        <ChatWindow
          chatRoom={chatRoom}
          onClose={() => setShowChat(false)}
          currentUserId={user.id}
        />
      )}
    </>
  );
};

export default ChatButton;
