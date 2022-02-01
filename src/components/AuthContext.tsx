import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';

interface IAuthContext {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const AuthContext = createContext<IAuthContext>({
  accessToken: '',
  setAccessToken: () => {
    throw new Error('Missing context');
  },
});

type NoProps = Record<string, unknown>;

export const AuthProvider: FC = ({ children }: PropsWithChildren<NoProps>) => {
  const initial = localStorage.getItem('accessToken') ?? '';
  const [accessToken, doSetAccessToken] = useState<string>(initial);

  const setAccessToken = useCallback((token: string) => {
    localStorage.setItem('accessToken', token ?? '');
    doSetAccessToken(token);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
