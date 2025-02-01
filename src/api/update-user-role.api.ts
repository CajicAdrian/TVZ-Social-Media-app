import { api } from './api';

export const updateUserRole = async (
  userId: number,
  newRole: 'ADMIN' | 'USER',
) => {
  const { data } = await api.patch('/auth/users/role', { userId, newRole });
  return data;
};
