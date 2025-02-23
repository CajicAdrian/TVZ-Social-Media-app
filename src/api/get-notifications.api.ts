import { api } from './api';

export interface ApiNotification {
  id: number;
  type: 'like' | 'comment' | 'like_comment';
  fromUser: { id: number; username: string; profileImage?: string };
  postTitle?: string; // ✅ Replaces the `post` object
  createdAt: string;
}

export const getNotificationsForUser = async (
  userId: number,
): Promise<ApiNotification[]> => {
  const { data } = await api.get(`/notifications/${userId}`); // ✅ Correct interpolation
  return data;
};
