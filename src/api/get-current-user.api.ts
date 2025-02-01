import { api } from './api';

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/auth/me'); // Ensure this endpoint exists
    console.log('✅ Fetched Current User:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error in getCurrentUser:', error);
    throw error;
  }
};
