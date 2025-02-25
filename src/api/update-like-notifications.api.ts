import { api } from './api';

export const updateLikeNotifications = async (
  userId: number,
  enabled: boolean,
): Promise<void> => {
  await api.patch(`/settings/${userId}/like-notifications`, { enabled });
};
