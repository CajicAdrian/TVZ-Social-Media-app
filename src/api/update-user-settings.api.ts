import { api } from './api';
import { ApiUser } from 'api';

export const updateUserSettings = async (userData: Partial<ApiUser>) => {
  const { data } = await api.patch('/auth/settings', userData);

  // ✅ Update localStorage with the new token
  if (data.newToken) {
    localStorage.setItem('token', data.newToken);
  }

  return data.user; // ✅ Return only the user object
};
