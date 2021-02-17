import axios from 'axios';
import { login } from './user-login.api';

const api = `http://localhost:3000/auth/signup`;

interface Login {
  accessToken: string;
}
interface FormData {
  username: string;
  password: string;
}

export const signup = async (input: FormData): Promise<Login> => {
  const { username, password } = input;
  const params = new URLSearchParams();

  params.append('password', password);
  params.append('username', username);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const { status } = await axios.post(api, params, config);
  if (status > 199 && status < 300) {
    return login(input);
  }
  return { accessToken: '' };
};
