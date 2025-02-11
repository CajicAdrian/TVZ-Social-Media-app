import { api } from 'api';

export const getUserTheme = async (userId: number): Promise<string> => {
  const res = await api.get(`/settings/${userId}/dark-mode`);
  return res.data.darkMode;
};
