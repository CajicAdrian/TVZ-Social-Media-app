import { api } from './api';

// Delete User (DELETE)
export const deleteUser = async (userId: number) => {
  await api.delete(`/auth/deleteuser/${userId}`);
};
