import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import useChatMessages from '@/hooks/useChatMessages';
import useChatRoom from '@/hooks/useChatRoom';

const MessageList = ({ chatRoomId, currentUserId }) => {
  const { messages, loading, hasMore, loadMore } = useChatMessages(chatRoomId, currentUserId);
  const { typingUser } = useChatRoom(chatRoomId, currentUserId);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      // Only scroll if we are already near the bottom or it's the first load
      // For now, let's just scroll to bottom like the original implementation
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container && container.scrollTop === 0 && hasMore && !loading) {
      loadMore();
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
          {typingUser && <TypingIndicator userName={typingUser} />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
