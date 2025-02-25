import { api } from './api';

export interface ApiComment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
  likeCount: number;
  isLikedByUser: boolean;
}

export const getComments = async (postId: number): Promise<ApiComment[]> => {
  const { data } = await api.get<ApiComment[]>(`/posts/${postId}/comments`);

  return data;
};
