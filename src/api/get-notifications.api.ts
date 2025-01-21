import { api } from './api';

export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow';
  fromUser: { id: number; username: string };
  post?: { id: number; title: string };
  read: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const { data } = await api.get('/notifications');
  return data;
};
