import { api } from './api';

export const uploadProfileImage = async (userId: number, file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post(`/images/user-image/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};
