import axios, { AxiosRequestConfig } from 'axios';
import { useContext } from 'react';
import { AuthContext } from 'components';

const api = `http://localhost:3000/posts`;

interface CreatePostInterface {
  imageId: number;
  title: string;
  description: string;
}

export const createPost = async (props: CreatePostInterface): Promise<void> => {
  const { description, imageId, title } = props;
  const dataForm = new URLSearchParams();
  const { accessToken } = useContext(AuthContext);

  dataForm.append('title', title);
  dataForm.append('description', description);
  dataForm.append('imageId', `${imageId}`);
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  axios.post(api, dataForm, config);
};
