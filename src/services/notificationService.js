import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const notificationService = {
  // Lấy danh sách notifications
  getNotifications: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đánh dấu notification đã đọc
  markAsRead: async (notificationId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.MARK_NOTIFICATION_READ(notificationId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đánh dấu tất cả notifications đã đọc
  markAllAsRead: async () => {
    try {
      const notifications = await notificationService.getNotifications();
      if (notifications.success && notifications.data) {
        const unreadNotifications = notifications.data.filter(n => !n.read);
        await Promise.all(
          unreadNotifications.map(n => notificationService.markAsRead(n.id))
        );
      }
      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default notificationService;