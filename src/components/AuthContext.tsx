import React, {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { getCurrentUser } from 'api';

// Define User interface
interface User {
  id: number;
  username: string;
}

// Define Authentication Context Interface
interface IAuthContext {
  accessToken: string;
  setAccessToken: (token: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isInitialized: boolean;
}

export const AuthContext = createContext<IAuthContext>({
  accessToken: '',
  setAccessToken: () => {},
  user: null,
  setUser: () => {},
  isInitialized: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('🔍 Checking localStorage for session...');

    const storedToken = localStorage.getItem('accessToken');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    console.log('🟡 Initial values from localStorage:', {
      storedToken,
      storedUser,
    });

    if (storedToken && storedUser) {
      console.log('✅ Found session in storage, setting user & token');
      setAccessToken(storedToken);
      setUser(storedUser);
    } else {
      console.warn('🚨 No valid session found, forcing login.');
    }

    // ✅ Always set `isInitialized = true` at the end
    setTimeout(() => {
      console.log('✅ AuthContext fully initialized!');
      setIsInitialized(true);
    }, 100); // Small delay to allow React to update state
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};
