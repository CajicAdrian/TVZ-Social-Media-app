import { api } from './api';

// ✅ Toggle Comment Notification Setting
export const updateCommentNotifications = async (
  userId: number,
  enabled: boolean,
): Promise<void> => {
  await api.patch(`/settings/${userId}/comment-notifications`, { enabled });
};
