import axios, { AxiosRequestConfig } from 'axios';
import { useContext } from 'react';
import { AuthContext } from 'components';

const api = `http://localhost:3000/images/post-images`;

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}

export const uploadImage = async (image: FileList): Promise<Image> => {
  const dataForm = new FormData();
  dataForm.append('image', image[0]);
  const { accessToken } = useContext(AuthContext);
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  const { data } = await axios.post(api, dataForm, config);
  console.log(data);
  return data;
};
