import { api } from './api';

// ✅ Get Like Notification Setting
export const getLikeNotifications = async (
  userId: number,
): Promise<boolean> => {
  const response = await api.get(`/settings/${userId}/like-notifications`);
  return response.data.enabled;
};
