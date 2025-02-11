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
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.getItem('accessToken') || '',
  );
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null'),
  );

  // ✅ Integrate App Settings
  const { settings } = useAppSettings(user?.id);
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
          console.error('❌ Failed to fetch user:', error);
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
      console.log('⚙️ Applying user settings on login:', settings);

      // ✅ Apply Language (but don't reset it on dark mode toggle)
      if (settings.language && settings.language !== i18n.language) {
        i18n.changeLanguage(settings.language);
      }

      // ✅ Apply Dark Mode from WinReg (Only on login)
      if (settings.darkMode !== colorMode) {
        console.log(`🎨 Applying dark mode from WinReg: ${settings.darkMode}`);
        setColorMode(settings.darkMode);
      }
    }
  }, [user, settings.language, settings.darkMode, i18n]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};
