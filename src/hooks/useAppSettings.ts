import { useEffect, useState } from 'react';
import {
  getUserTheme,
  getUserLanguage,
  getLikeNotifications,
  getCommentNotifications,
  getIniSettings,
} from 'api';
import { useColorMode } from '@chakra-ui/react';

export const useAppSettings = (userId?: number) => {
  const { setColorMode } = useColorMode();

  const [appSettings, setAppSettings] = useState(() => {
    return JSON.parse(
      localStorage.getItem('userSettings') ||
        JSON.stringify({
          language: 'en',
          darkMode: 'light',
          notificationRefreshRate: '30s',
          likeNotifications: true,
          commentNotifications: true,
          adminUsername: '',
          maxUploadSize: '10MB',
          tokenExpirationTime: '3600s',
        }),
    );
  });

  useEffect(() => {
    if (!userId) return;

    const applySettings = async () => {
      const [
        theme,
        userLanguage,
        likeNotifications,
        commentNotifications,
        iniSettings,
      ] = await Promise.all([
        getUserTheme(userId),
        getUserLanguage(userId),
        getLikeNotifications(userId),
        getCommentNotifications(userId),
        getIniSettings(),
      ]);

      setColorMode(theme || 'light');

      const updatedSettings = {
        darkMode: theme || 'light',
        language: userLanguage || 'en',
        likeNotifications: likeNotifications ?? true,
        commentNotifications: commentNotifications ?? true,
        adminUsername: iniSettings.adminUsername || 'DomV',
        maxUploadSize: iniSettings.maxUploadSize || '10MB',
        tokenExpirationTime: `${iniSettings.tokenExpirationTime}s` || '3600s',
      };

      setAppSettings(updatedSettings);
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
    };

    applySettings();
  }, [userId]);

  return { appSettings, setAppSettings };
};
