import { api } from './api';

export const getLikeNotifications = async (
  userId: number,
): Promise<boolean> => {
  const response = await api.get(`/settings/${userId}/like-notifications`);
  return response.data.enabled;
};
