import { createContext, useContext, useEffect, useState } from 'react';
import chatService from '@/services/chatService';
import { useAuthStore } from '@/store/authStore';

const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      connectWebSocket();
    }

    return () => {
      if (connected) {
        chatService.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  const connectWebSocket = async () => {
    if (connecting || connected) return;

    try {
      setConnecting(true);
      await chatService.connect(token);
      setConnected(true);
      console.log('WebSocket connected successfully');
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  };

  const value = {
    connected,
    connecting,
    reconnect: connectWebSocket,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
