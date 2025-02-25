import { api } from './api';

export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  try {
    const { data } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    const errorString = JSON.stringify(error);
    const isUnauthorized = errorString.includes('401');

    if (isUnauthorized) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    }

    throw error;
  }
};
