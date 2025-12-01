import { useState, useEffect, useCallback } from 'react';
import chatService from '@/services/chatService';
import chatNotificationService from '@/services/chatNotificationService';

export const useChatMessages = (chatRoomId, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadMessages = useCallback(async (pageNum = 0) => {
    try {
      const response = await chatService.getMessages(chatRoomId, pageNum, 50);
      const newMessages = response.data.content;

      if (pageNum === 0) {
        setMessages(newMessages.reverse());
      } else {
        setMessages((prev) => [...newMessages.reverse(), ...prev]);
      }

      setHasMore(!response.data.last);
      setLoading(false);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  }, [chatRoomId]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setPage(0);
    loadMessages(0);

    // Request notification permission on first chat open
    chatNotificationService.requestPermission();

    // Subscribe to new messages
    const messageSubscription = chatService.subscribeToRoom(chatRoomId, (message) => {
      setMessages((prev) => [...prev, message]);

      // Mark as read if not sent by current user
      if (message.senderId !== currentUserId) {
        chatService.markAsReadWS(chatRoomId);

        // Show browser notification
        chatNotificationService.showMessageNotification(
          message.senderName,
          message.content,
          chatRoomId,
          () => {
            // Focus on chat window when notification is clicked
            window.focus();
          }
        );
      }
    });

    // Subscribe to read receipts
    const readSubscription = chatService.subscribeToRead(chatRoomId, (userId) => {
      if (userId !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUserId && msg.status !== 'READ'
              ? { ...msg, status: 'READ' }
              : msg
          )
        );
      }
    });

    // Mark messages as read when opening chat
    chatService.markAsRead(chatRoomId);

    return () => {
      if (messageSubscription) messageSubscription.unsubscribe();
      if (readSubscription) readSubscription.unsubscribe();
    };
  }, [chatRoomId, currentUserId, loadMessages]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(nextPage);
    }
  }, [loading, hasMore, page, loadMessages]);

  return {
    messages,
    loading,
    hasMore,
    loadMore
  };
};

export default useChatMessages;
