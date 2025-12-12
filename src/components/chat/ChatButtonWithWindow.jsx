import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';
import chatService from '@/services/chatService';
import { useAuthStore } from '@/store/authStore';
import useUnreadCount from '@/hooks/useUnreadCount';

const ChatButtonWithWindow = ({ bookingId, booking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { unreadPerRoom } = useUnreadCount();

  // Only show for CONFIRMED and IN_PROGRESS bookings
  const canChat = booking && (
    booking.status === 'CONFIRMED' || 
    booking.status === 'IN_PROGRESS'
  );

  const handleOpenChat = async () => {
    if (!canChat) return;

    try {
      setLoading(true);
      const response = await chatService.getChatRoomByBooking(bookingId);
      setChatRoom(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Error opening chat:', error);
      // If chat room doesn't exist yet, it might be created on first message
      // For now, just show an error
      alert('Chat room not available yet. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!canChat) return null;

  const unreadCount = chatRoom ? (unreadPerRoom[chatRoom.id] || 0) : 0;

  return (
    <>
      <button
        onClick={handleOpenChat}
        disabled={loading}
        className="relative inline-flex items-center gap-2 px-4 py-2 bg-primary-600  rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MessageCircle size={20} />
        <span>Chat</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500  text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && chatRoom && (
        <ChatWindow
          chatRoom={chatRoom}
          onClose={() => setIsOpen(false)}
          currentUserId={user?.id}
        />
      )}
    </>
  );
};

export default ChatButtonWithWindow;
