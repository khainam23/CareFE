import { useState, useEffect } from 'react';
import { X, Wifi, WifiOff } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineStatusBadge from './OnlineStatusBadge';
import ChatErrorBoundary from './ChatErrorBoundary';
import chatService from '@/services/chatService';

const ChatWindow = ({ chatRoom, onClose, currentUserId }) => {
  const [connected, setConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    // Determine the other user in the chat
    const isCustomer = chatRoom.customerId === currentUserId;
    setOtherUser({
      id: isCustomer ? chatRoom.caregiverId : chatRoom.customerId,
      name: isCustomer ? chatRoom.caregiverName : chatRoom.customerName,
    });

    // Monitor connection status
    const unsubscribe = chatService.onConnectionChange((isConnected) => {
      setConnected(isConnected);
    });

    setConnected(chatService.isConnected());

    return () => {
      unsubscribe();
    };
  }, [chatRoom, currentUserId]);

  return (
    <ChatErrorBoundary
      errorMessage="Failed to load chat. Please try again."
      onReset={() => window.location.reload()}
    >
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center font-semibold">
                {otherUser?.name?.charAt(0).toUpperCase()}
              </div>
              {otherUser && <OnlineStatusBadge userId={otherUser.id} />}
            </div>
            <div>
              <h3 className="font-semibold">{otherUser?.name}</h3>
              <div className="flex items-center gap-1 text-xs">
                {connected ? (
                  <>
                    <Wifi size={12} />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} />
                    <span>Reconnecting...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-primary-700 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <ChatErrorBoundary errorMessage="Failed to load messages.">
          <MessageList chatRoomId={chatRoom.id} currentUserId={currentUserId} />
        </ChatErrorBoundary>

        {/* Input */}
        <ChatErrorBoundary errorMessage="Failed to load message input.">
          <MessageInput chatRoomId={chatRoom.id} />
        </ChatErrorBoundary>
      </div>
    </ChatErrorBoundary>
  );
};

export default ChatWindow;
