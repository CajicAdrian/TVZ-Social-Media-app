import { api } from './api';

interface CreatePostInterface {
  imageId: number;
  title: string;
  description: string;
}

export const createPost = async (props: CreatePostInterface): Promise<void> => {
  const { description, imageId, title } = props;
  const dataForm = new URLSearchParams();

  dataForm.append('title', title);
  dataForm.append('description', description);
  dataForm.append('imageId', `${imageId}`);

  api.post('/posts', dataForm, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
