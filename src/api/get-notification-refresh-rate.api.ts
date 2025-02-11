import { api } from 'api';

export const getNotificationRefreshRate = async (
  userId: number,
): Promise<string> => {
  const response = await api.get(
    `/settings/${userId}/notification-refresh-rate`,
  );
  return response.data.refreshRate;
};
