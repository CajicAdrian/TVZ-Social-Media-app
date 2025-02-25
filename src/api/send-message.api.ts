import { api } from './api';

export const sendMessage = async (
  senderId: number,
  receiverId: number,
  message: string,
) => {
  const response = await api.post('/messages', {
    senderId,
    receiverId,
    message,
  });
  return response.data;
};
