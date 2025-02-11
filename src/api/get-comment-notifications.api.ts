import { api } from './api';

// ✅ Get Comment Notification Setting
export const getCommentNotifications = async (
  userId: number,
): Promise<boolean> => {
  const response = await api.get(`/settings/${userId}/comment-notifications`);
  return response.data.enabled;
};
