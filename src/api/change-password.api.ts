import { api } from './api';

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  return await api.patch('/auth/change-password', {
    currentPassword,
    newPassword,
  });
};
