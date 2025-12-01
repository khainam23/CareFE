import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import chatService from '@/services/chatService';

const MessageInput = ({ chatRoomId, readOnly = false, readOnlyMessage = null }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const handleTyping = (value) => {
    setMessage(value);
    setError(null); // Clear error on typing

    // Send typing indicator
    if (value && !isTypingRef.current) {
      isTypingRef.current = true;
      chatService.sendTypingIndicator(chatRoomId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        chatService.sendTypingIndicator(chatRoomId, false);
      }
    }, 3000);
  };

  const handleSend = async () => {
    if (!message.trim() || sending || readOnly) return;

    setSending(true);
    setError(null);

    try {
      // Stop typing indicator
      if (isTypingRef.current) {
        isTypingRef.current = false;
        chatService.sendTypingIndicator(chatRoomId, false);
      }

      // Send message
      chatService.sendMessage(chatRoomId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        chatService.sendTypingIndicator(chatRoomId, false);
      }
    };
  }, [chatRoomId]);

  if (readOnly) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <AlertCircle size={16} />
          <span>{readOnlyMessage || 'This chat is read-only'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-h-32"
          rows={1}
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
