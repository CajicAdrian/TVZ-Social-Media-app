import { api } from 'api';

export const updateNotificationRefreshRate = async (
  userId: number,
  rate: string,
): Promise<void> => {
  await api.patch(`/settings/${userId}/notification-refresh-rate`, { rate });
};
