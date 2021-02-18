import axios, { AxiosRequestConfig } from 'axios';

const api = `http://localhost:3000/posts`;

interface CreatePostInterface {
  imageId: number;
  title: string;
  description: string;
}

export const createPost = async (props: CreatePostInterface): Promise<void> => {
  const { description, imageId, title } = props;
  const dataForm = new FormData();
  const token = localStorage.getItem('accessToken');
  dataForm.append('title', title);
  dataForm.append('description', description);
  dataForm.append('imageId', `${imageId}`);
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  axios.post(api, dataForm, config);
};
