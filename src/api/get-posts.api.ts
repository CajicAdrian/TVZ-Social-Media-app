import { api } from './api';

interface Post {
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

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get('/posts');

  return data;
};
