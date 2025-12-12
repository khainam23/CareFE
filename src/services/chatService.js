import axiosInstance from '@/api/axiosConfig';
import chatWebSocketService from './chatWebSocketService';

const API_BASE = '/api/chat';

// Event emitter for REST API messages
const messageEventListeners = new Set();

export const chatService = {
  // REST API methods
  getChatRooms: async () => {
    const response = await axiosInstance.get(`${API_BASE}/rooms`);
    return response.data;
  },

  getChatRoomByBooking: async (bookingId) => {
    const response = await axiosInstance.get(`${API_BASE}/rooms/booking/${bookingId}`);
    return response.data;
  },

  createChatRoomForBooking: async (bookingId) => {
    const response = await axiosInstance.post(`${API_BASE}/rooms/create-for-booking/${bookingId}`);
    return response.data;
  },

  getMessages: async (roomId, page = 0, size = 50) => {
    const response = await axiosInstance.get(`${API_BASE}/rooms/${roomId}/messages`, {
      params: { page, size },
    });
    return response.data;
  },

  markAsRead: async (roomId) => {
    const response = await axiosInstance.post(`${API_BASE}/rooms/${roomId}/read`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get(`${API_BASE}/unread-count`);
    return response.data;
  },

  // WebSocket methods
  connect: (token) => {
    return chatWebSocketService.connect(token);
  },

  disconnect: () => {
    chatWebSocketService.disconnect();
  },

  sendMessage: async (chatRoomId, content) => {
    // Always use REST API for sending messages to ensure reliability and persistence
    // The backend will broadcast the message via WebSocket to all subscribers
    try {
      const response = await axiosInstance.post(`${API_BASE}/rooms/${chatRoomId}/messages`, {
        content,
      });

      // Emit event for local message handling
      const message = response.data.data;
      messageEventListeners.forEach(listener => {
        try {
          listener({ chatRoomId, message });
        } catch (err) {
          console.error('Error in message event listener:', err);
        }
      });

      return { success: true, method: 'rest', data: response.data };
    } catch (error) {
      console.error('Failed to send message via REST API:', error);
      throw error;
    }
  },

  // Deprecated: Internal use only if needed
  sendMessageWS: (chatRoomId, content) => {
    if (chatWebSocketService.isConnected()) {
      chatWebSocketService.send('/app/chat/send', {
        chatRoomId,
        content,
      });
    }
  },

  sendTypingIndicator: (chatRoomId, isTyping) => {
    chatWebSocketService.send('/app/chat/typing', {
      chatRoomId,
      isTyping,
    });
  },

  markAsReadWS: (chatRoomId) => {
    chatWebSocketService.send('/app/chat/read', chatRoomId);
  },

  subscribeToRoom: (roomId, onMessage) => {
    return chatWebSocketService.subscribe(`/topic/chat/${roomId}`, onMessage);
  },

  subscribeToTyping: (roomId, onTyping) => {
    return chatWebSocketService.subscribe(`/topic/chat/${roomId}/typing`, onTyping);
  },

  subscribeToRead: (roomId, onRead) => {
    return chatWebSocketService.subscribe(`/topic/chat/${roomId}/read`, onRead);
  },

  subscribeToPresence: (userId, onPresence) => {
    return chatWebSocketService.subscribe(`/topic/presence/${userId}`, onPresence);
  },

  isConnected: () => {
    return chatWebSocketService.isConnected();
  },

  onConnectionChange: (callback) => {
    return chatWebSocketService.onConnectionChange(callback);
  },

  // Subscribe to REST API messages
  onRestMessage: (callback) => {
    messageEventListeners.add(callback);
    return () => {
      messageEventListeners.delete(callback);
    };
  },
};

export default chatService;
