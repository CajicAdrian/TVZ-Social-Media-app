import { api } from 'api';

export const updateAdminUsername = async (newUsername: string) => {
  await api.patch('/settings/admin-username', { adminUsername: newUsername });
};
