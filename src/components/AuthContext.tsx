import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getCurrentUser } from 'api'; // ✅ Import API call

interface User {
  id: number;
  username: string;
  bio?: string;
  profileImage?: string;
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
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        const storedToken = localStorage.getItem('accessToken') || '';

        if (storedUser) {
          setUser(storedUser); // ✅ Load stored user
        }

        if (storedToken) {
          setAccessToken(storedToken);
        }

        if (!storedUser && storedToken) {
          const fetchedUser = await getCurrentUser(); // ✅ Fetch user with profile image
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser)); // ✅ Save to localStorage
          }
        }
      } catch (error) {
        console.error('❌ Failed to fetch user:', error);
      }
    };

    fetchUser();
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
