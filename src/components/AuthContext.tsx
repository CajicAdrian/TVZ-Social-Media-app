import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

interface User {
  id: number;
  username: string;
  bio?: string;
}

interface IAuthContext {
  accessToken: string;
  setAccessToken: (token: string) => void;
  user: User | null;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<IAuthContext>({
  accessToken: '',
  setAccessToken: () => {
    throw new Error('Missing context');
  },
  user: null,
  setUser: () => {
    throw new Error('Missing context');
  },
});

type NoProps = Record<string, unknown>;

export const AuthProvider: FC = ({ children }: PropsWithChildren<NoProps>) => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Retrieve user and token from localStorage (if available) on app load
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const storedToken = localStorage.getItem('accessToken') || '';
    if (storedUser) setUser(storedUser);
    if (storedToken) setAccessToken(storedToken);
  }, []);

  useEffect(() => {
    // Save user and token to localStorage whenever they are updated
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    else localStorage.removeItem('accessToken');
  }, [user, accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
