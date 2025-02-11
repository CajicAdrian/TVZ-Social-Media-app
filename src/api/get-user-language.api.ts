import { api } from 'api';

export const getUserLanguage = async (userId: number): Promise<string> => {
  const res = await api.get(`/settings/${userId}/language`);
  return res.data.language;
};
