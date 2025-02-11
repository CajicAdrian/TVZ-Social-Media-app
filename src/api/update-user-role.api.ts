import { api } from './api';

export const updateUserRole = async (
  userId: number,
  newRole: 'ADMIN' | 'USER',
) => {
  const { data } = await api.patch(`/auth/updaterole/${userId}`, {
    role: newRole,
  });
  return data;
};
