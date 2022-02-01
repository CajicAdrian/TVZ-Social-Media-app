import axios from 'axios';
import { login } from './user-login.api';

const api = `http://localhost:3000/auth/signup`;

interface SignupSuccess {
  status: 'success';
  accessToken: string;
}

interface SignupError {
  status: 'error';
  messages: string[];
}

type SignupResult = SignupSuccess | SignupError;

interface FormData {
  username: string;
  password: string;
}

export const signup = async (input: FormData): Promise<SignupResult> => {
  const { username, password } = input;
  const params = new URLSearchParams();

  params.append('password', password);
  params.append('username', username);

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    await axios.post(api, params, config);
    const { accessToken } = await login(input);
    return { status: 'success', accessToken };
  } catch (err) {
    let messages = ['Unknown error'];
    if (axios.isAxiosError(err)) {
      const { response } = err;
      if (!response) {
        throw err;
      }

      if (response.data.message) {
        messages = response.data.message;
      }
    }

    return { status: 'error', messages };
  }
};
