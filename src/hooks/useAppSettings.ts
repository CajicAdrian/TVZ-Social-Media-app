import { useEffect, useState } from 'react';
import {
  getNotificationRefreshRate,
  getUserTheme,
  getUserLanguage,
  getLikeNotifications,
  getCommentNotifications,
  getIniSettings,
} from 'api';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@chakra-ui/react';

export const useAppSettings = (userId?: number) => {
  const { i18n } = useTranslation();
  const { setColorMode } = useColorMode();

  // ✅ Load from localStorage (or use defaults)
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
      try {
        console.log('⚙️ Fetching settings from WinReg...');

        const [
          theme,
          userLanguage,
          userRefreshRate,
          likeNotifications,
          commentNotifications,
          iniSettings,
        ] = await Promise.all([
          getUserTheme(userId),
          getUserLanguage(userId),
          getNotificationRefreshRate(userId),
          getLikeNotifications(userId),
          getCommentNotifications(userId),
          getIniSettings(),
        ]);

        console.log('🔄 Loaded INI Settings:', iniSettings);

        // ✅ Update theme immediately
        setColorMode(theme || 'light');

        // ✅ Merge settings into one object
        const updatedSettings = {
          darkMode: theme || 'light',
          language: userLanguage || 'en',
          notificationRefreshRate: userRefreshRate || '30s',
          likeNotifications: likeNotifications ?? true,
          commentNotifications: commentNotifications ?? true,
          adminUsername: iniSettings.adminUsername || 'DomV',
          maxUploadSize: iniSettings.maxUploadSize || '10MB',
          tokenExpirationTime: `${iniSettings.tokenExpirationTime}s` || '3600s',
        };

        // ✅ Save to both **state** and **localStorage**
        setAppSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

        console.log('✅ Settings Applied:', updatedSettings);
      } catch (error) {
        console.error('❌ Failed to load settings:', error);
      }
    };

    applySettings();
  }, [userId]);

  return { appSettings, setAppSettings };
};
