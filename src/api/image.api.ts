import { api } from './api';

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}

export const uploadImage = async (image: FileList): Promise<Image> => {
  const dataForm = new FormData();
  dataForm.append('image', image[0]);

  const { data } = await api.post('/images/post-images', dataForm);
  console.log(data);
  return data;
};
