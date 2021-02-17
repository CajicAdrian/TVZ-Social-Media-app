import axios from 'axios';

const api = `http://localhost:3000/posts`;

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
  const token = localStorage.getItem('accessToken');

  if (token) {
    const { data } = await axios.post(api, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
  return [];
};
