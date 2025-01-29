import { api } from './api';

// Mark a notification as read
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await api.patch(`/notifications/${notificationId}/read`);
};
