import axiosInstance from '../api/axiosConfig';
import { API_ENDPOINTS } from '../api/endpoints';

export const supportService = {
  // Lấy danh sách tickets
  getTickets: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SUPPORT.TICKETS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy tickets chưa được gán
  getUnassignedTickets: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SUPPORT.UNASSIGNED_TICKETS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Gán ticket cho mình
  assignTicket: async (ticketId) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.SUPPORT.ASSIGN_TICKET(ticketId));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật ticket
  updateTicket: async (ticketId, updateData) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.SUPPORT.UPDATE_TICKET(ticketId), updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Giải quyết ticket
  resolveTicket: async (ticketId, solution) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.SUPPORT.RESOLVE_TICKET(ticketId), {
        solution
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Escalate ticket lên Admin
  escalateTicket: async (ticketId, reason) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.SUPPORT.ESCALATE_TICKET(ticketId), {
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo support ticket (cho user)
  createSupportTicket: async (ticketData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CREATE_SUPPORT_TICKET, ticketData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default supportService;