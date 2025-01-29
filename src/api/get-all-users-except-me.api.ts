import { api } from './api';

export interface ApiUser {
  id: number;
  username: string;
  bio?: string; // Add any additional fields if required
  profilePictureUrl?: string; // Placeholder for user pictures
}

export const getAllUsersExceptMe = async (): Promise<ApiUser[]> => {
  try {
    const response = await api.get('/auth/getallusers/exceptme');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};
