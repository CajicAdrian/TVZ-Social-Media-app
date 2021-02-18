import axios, { AxiosRequestConfig } from 'axios';

const api = `http://localhost:3000/images/post-images`;

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}

export const uploadImage = async (image: FileList): Promise<Image> => {
  const dataForm = new FormData();
  dataForm.append('image', image[0]);
  const token = localStorage.getItem('accessToken');
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const { data } = await axios.post(api, dataForm, config);
  console.log(data);
  return data;
};
