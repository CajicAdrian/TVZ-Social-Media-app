import { api } from './api';

export interface ApiPost {
  id: number;
  title: string;
  description: string;
  images: Image[];
}

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}

export const getPosts = async (): Promise<ApiPost[]> => {
  const { data } = await api.get('/posts');

  return data;
};
