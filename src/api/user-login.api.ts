import { api } from './api';

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
  const { username, password } = input;
  const params = new URLSearchParams();

  params.append('password', password);
  params.append('username', username);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const { data } = await api.post('/auth/signin', params, config);
  return data;
};
