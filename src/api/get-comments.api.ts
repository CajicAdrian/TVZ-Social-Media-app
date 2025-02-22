import { api } from './api';

export interface ApiComment {
  id: number;
  content: string;
  createdAt: string; // ✅ Ensure timestamp is included
  user: {
    id: number;
    name: string;
  };
  likeCount: number; // ✅ Total number of likes on the comment
  isLikedByUser: boolean; // ✅ Whether the logged-in user liked this comment
}

export const getComments = async (postId: number): Promise<ApiComment[]> => {
  const { data } = await api.get<ApiComment[]>(`/posts/${postId}/comments`);

  return data;
};
