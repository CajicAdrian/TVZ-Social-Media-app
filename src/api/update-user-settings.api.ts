import { api } from './api';
import { ApiUser } from 'api';

export const updateUserSettings = async (userData: Partial<ApiUser>) => {
  const { data } = await api.patch('/auth/settings', userData);

  if (data.newToken) {
    localStorage.setItem('token', data.newToken);
  }

  return data.user;
};
