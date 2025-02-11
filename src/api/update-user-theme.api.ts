import { api } from 'api';

export const updateUserTheme = async (
  userId: number,
  darkMode: string,
): Promise<void> => {
  await api.patch(`/settings/${userId}/dark-mode`, { darkMode });
};
