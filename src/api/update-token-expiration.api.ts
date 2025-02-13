import { api } from 'api';

export const updateTokenExpirationTime = async (time: string) => {
  await api.patch('/settings/token-expiration-time', {
    tokenExpirationTime: time,
  });
};
