import { api } from './api';

export const getWinSettings = async (userId: number) => {
  const res = await api.get(`/settings/${userId}/all`);
  return res.data;
};
