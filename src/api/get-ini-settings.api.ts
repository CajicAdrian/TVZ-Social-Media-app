import { api } from 'api';

// ✅ Get Admin Settings
export const getIniSettings = async () => {
  const response = await api.get('/settings/ini');
  return response.data;
};
