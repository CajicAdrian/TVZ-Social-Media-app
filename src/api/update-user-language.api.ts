import { api } from 'api';

export const updateUserLanguage = async (
  userId: number,
  language: string,
): Promise<void> => {
  await api.patch(`/settings/${userId}/language`, { language });
};
