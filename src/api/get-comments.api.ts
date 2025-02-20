import { api } from './api';

export interface ApiComment {
  id: number;
  content: string;
  createdAt: string; // ✅ Ensure timestamp is included
  user: {
    id: number;
    name: string;
  };
}

export const getComments = async (postId: number): Promise<ApiComment[]> => {
  const { data } = await api.get<ApiComment[]>(`/posts/${postId}/comments`);

  return data;
};
