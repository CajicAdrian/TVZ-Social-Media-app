import { api } from './api';

export const updateCommentNotifications = async (
  userId: number,
  enabled: boolean,
): Promise<void> => {
  await api.patch(`/settings/${userId}/comment-notifications`, { enabled });
};
