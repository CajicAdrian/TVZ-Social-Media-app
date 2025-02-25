import React, { ReactElement } from 'react';
import { Button, useColorMode } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const LogoutButton = (): ReactElement => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();

    i18n.changeLanguage('en');
    if (colorMode === 'dark') toggleColorMode();

    navigate('/');

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <Button onClick={logout} fontSize={'sm'} fontWeight={600} colorScheme="red">
      {t('logout')}
    </Button>
  );
};
