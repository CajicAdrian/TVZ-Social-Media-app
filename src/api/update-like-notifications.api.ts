import { api } from './api';

// ✅ Toggle Like Notification Setting
export const updateLikeNotifications = async (
  userId: number,
  enabled: boolean,
): Promise<void> => {
  await api.patch(`/settings/${userId}/like-notifications`, { enabled });
};
