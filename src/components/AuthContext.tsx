import React, {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { getCurrentUser } from 'api';
import { useAppSettings } from '../hooks/useAppSettings';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@chakra-ui/react';

interface User {
  id: number;
  username: string;
}

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
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );

  const { appSettings } = useAppSettings(user?.id);
  const { i18n } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (storedToken && !storedUser) {
      (async () => {
        try {
          const fetchedUser = await getCurrentUser();
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser));
          }
        } catch (error) {
          setAccessToken('');
          setUser(null);
        } finally {
          setIsInitialized(true);
        }
      })();
    } else {
      setAccessToken(storedToken || '');
      setUser(storedUser);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (appSettings.language && appSettings.language !== i18n.language) {
        i18n.changeLanguage(appSettings.language);
      }

      if (appSettings.darkMode !== colorMode) {
        setColorMode(appSettings.darkMode);
      }
    }
  }, [user, appSettings.language, appSettings.darkMode, i18n]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};
