import { useState, useEffect, useCallback } from 'react';
import chatService from '@/services/chatService';
import { useAuthStore } from '@/store/authStore';

export const useUnreadCount = (chatRoomId = null) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadPerRoom, setUnreadPerRoom] = useState({});
  const { isAuthenticated } = useAuthStore();

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await chatService.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated]);

  const fetchChatRooms = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await chatService.getChatRooms();
      const rooms = response.data || [];
      const counts = {};
      rooms.forEach(room => {
        counts[room.id] = room.unreadCount || 0;
      });
      setUnreadPerRoom(counts);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    fetchChatRooms();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchChatRooms();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount, fetchChatRooms]);

  const resetRoomCount = useCallback((roomId) => {
    setUnreadPerRoom(prev => ({
      ...prev,
      [roomId]: 0
    }));
    // Also refresh total count
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const incrementRoomCount = useCallback((roomId) => {
    setUnreadPerRoom(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) + 1
    }));
    setUnreadCount(prev => prev + 1);
  }, []);

  return {
    unreadCount,
    unreadPerRoom,
    refreshUnreadCount: fetchUnreadCount,
    resetRoomCount,
    incrementRoomCount
  };
};

export default useUnreadCount;
