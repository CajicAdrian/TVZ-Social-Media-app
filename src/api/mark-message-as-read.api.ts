import { api } from './api';

// Mark Message as Read
export const markMessageAsRead = async (messageId: number) => {
  try {
    await api.patch(`/messages/${messageId}/read`);
  } catch (error) {
    console.error('Failed to mark message as read:', error);
    throw error;
  }
};
