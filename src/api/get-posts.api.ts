import axios, { AxiosRequestConfig } from 'axios';
import { useContext } from 'react';
import { AuthContext } from 'components';

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
  const { accessToken } = useContext(AuthContext);

  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  if (accessToken) {
    const { data } = await axios.get(api, config);
    return data;
  }
  return [];
};
