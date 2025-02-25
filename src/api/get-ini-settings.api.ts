import { api } from 'api';

export const getIniSettings = async () => {
  const response = await api.get('/settings/ini');
  return response.data;
};
