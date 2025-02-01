import { api } from './api';

export const getUserSettings = async () => {
  const { data } = await api.get('/auth/settings');
  return data;
};
