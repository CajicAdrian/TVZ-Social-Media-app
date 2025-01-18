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
  try {
    const { data } = await api.get(`/posts/user/${userId}`);
    console.log('Fetched Posts by User:', data); // Log the response
    return data;
  } catch (error) {
    console.error('Error in getPostsByUser:', error);
    throw error;
  }
};
