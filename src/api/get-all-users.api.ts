import { api } from './api';

export const getAllUsers = async () => {
  const { data } = await api.get('/auth/users');
  return data;
};
