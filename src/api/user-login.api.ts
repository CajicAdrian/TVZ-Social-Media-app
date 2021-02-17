import axios from 'axios';

const api = `http://localhost:3000/auth/signin`;

interface Login {
  accessToken: string;
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

  const { data } = await axios.post(api, params, config);
  return data;
};
