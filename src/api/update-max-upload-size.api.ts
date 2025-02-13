import { api } from 'api';

export const updateMaxUploadSize = async (size: string) => {
  await api.patch('/settings/max-upload-size', { maxUploadSize: size });
};
