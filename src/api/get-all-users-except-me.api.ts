import { api } from './api';

export interface ApiUser {
  id: number;
  username: string;
  bio?: string;
  profileImage?: string;
  email?: string;
  gender?: 'male' | 'female' | null;
}

export const getAllUsersExceptMe = async (): Promise<ApiUser[]> => {
  const response = await api.get('/auth/getallusers/exceptme');
  return response.data;
};
