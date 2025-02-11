import { api } from './api';

export const getCurrentUser = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.warn('🚨 No token found, redirecting to login...');
    window.location.href = '/login'; // 🔄 Force login
    return null;
  }

  try {
    const { data } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('✅ Fetched Current User:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error in getCurrentUser:', error);

    // ✅ Check if the error object is an Axios error (without using `.response`)
    const errorString = JSON.stringify(error);
    const isUnauthorized = errorString.includes('401');

    if (isUnauthorized) {
      console.warn('🔄 Token expired or invalid. Clearing session...');

      // ❌ Clear everything and force re-login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      setTimeout(() => {
        window.location.href = '/login'; // 🔄 Redirect after clearing storage
      }, 500);
    }

    throw error;
  }
};
