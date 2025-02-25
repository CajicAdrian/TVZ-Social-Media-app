import { api } from './api';

export interface ApiPost {
  id: number;
  title: string;
  description: string;
  images: Image[];
  username: string;
  commentCount: number;
  likedByCurrentUser: boolean;
  likeCount: number;
}

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
  posts: string;
}

export const getPostsByUser = async (userId: number): Promise<ApiPost[]> => {
  const { data } = await api.get(`/posts/user/${userId}`);
  return data;
};
