import { api } from './api'; // Your API utility

export interface ApiMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const getMessages = async (user1: number, user2: number) => {
  const response = await api.get('/messages', {
    params: { user1, user2 },
  });
  return response.data;
};
