import { api } from './api';

export const getCommentNotifications = async (
  userId: number,
): Promise<boolean> => {
  const response = await api.get(`/settings/${userId}/comment-notifications`);
  return response.data.enabled;
};
