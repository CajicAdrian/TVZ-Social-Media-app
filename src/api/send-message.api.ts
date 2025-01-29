import { api } from './api';

export const sendMessage = async (
  senderId: number,
  receiverId: number,
  message: string,
) => {
  try {
    const response = await api.post('/messages', {
      senderId,
      receiverId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error); // Debug log
    throw error;
  }
};
