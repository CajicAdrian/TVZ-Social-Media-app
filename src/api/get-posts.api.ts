import { api } from './api';

export interface ApiPost {
  id: number;
  title: string;
  description: string;
  images?: Image[]; // ✅ Optional to avoid "undefined" errors
  profileImage?: string; // ✅ Now directly part of the post
  username: string; // ✅ Now directly part of the post
  commentCount: number;
  likedByCurrentUser: boolean;
  likeCount: number;
}
interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}

export const getPosts = async (): Promise<ApiPost[]> => {
  const { data } = await api.get('/posts');
  console.log('📥 Fetched Posts:', data);
  return data;
};
