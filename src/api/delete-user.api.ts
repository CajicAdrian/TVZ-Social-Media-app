import { api } from './api';

export const deleteUser = async (userId: number) => {
  await api.delete(`/auth/deleteuser/${userId}`);
};
