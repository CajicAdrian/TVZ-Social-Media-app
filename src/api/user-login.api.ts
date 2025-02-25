import { api } from './api';
import { AxiosError } from 'axios'; // ✅ Import AxiosError for better error handling

interface Login {
  accessToken: string;
  user: {
    id: number;
    username: string;
    bio?: string;
  };
}

interface FormData {
  username: string;
  password: string;
}

export const login = async (input: FormData): Promise<Login> => {
  try {
    const { data } = await api.post('/auth/signin', input, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!data || !data.accessToken || !data.user) {
      throw new Error('❌ API response is missing content');
    }

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    throw new Error(
      axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message,
    );
  }
};
