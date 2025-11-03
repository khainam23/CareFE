import { create } from 'zustand';
import { notificationService } from '../services/notificationService';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  // Fetch notifications
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        const notifications = response.data || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        set({ 
          notifications, 
          unreadCount, 
          loading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ loading: false });
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      const { notifications } = get();
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      const unreadCount = updatedNotifications.filter(n => !n.read).length;
      set({ 
        notifications: updatedNotifications, 
        unreadCount 
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      const { notifications } = get();
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      set({ 
        notifications: updatedNotifications, 
        unreadCount: 0 
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  // Add new notification (for real-time updates)
  addNotification: (notification) => {
    const { notifications, unreadCount } = get();
    set({ 
      notifications: [notification, ...notifications],
      unreadCount: unreadCount + 1
    });
  }
}));

export default useNotificationStore;