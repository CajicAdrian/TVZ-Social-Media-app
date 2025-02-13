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

  // ✅ State for settings
  const [appSettings, setAppSettings] = useState({
    language: 'en',
    darkMode: 'light',
    notificationRefreshRate: '30s',
    likeNotifications: true,
    commentNotifications: true,
    adminUsername: '',
    maxUploadSize: '10MB',
    tokenExpirationTime: '3600s',
  });

  useEffect(() => {
    if (!userId) return;

    const applySettings = async () => {
      try {
        console.log('⚙️ Fetching settings from WinReg...');

        // ✅ Fetch Dark Mode **FIRST AND SEPARATE**
        getUserTheme(userId).then((userTheme) => {
          const theme = userTheme || 'light';
          console.log(`🎨 Loaded theme from WinReg: ${theme}`);

          // ✅ Apply Dark Mode IMMEDIATELY (Before Other Settings Load)
          setColorMode(theme);

          // ✅ Save in State
          setAppSettings((prev) => ({ ...prev, darkMode: theme }));
        });

        // ✅ Fetch Language & Apply Immediately
        getUserLanguage(userId).then((userLanguage) => {
          if (userLanguage) {
            console.log(`🌍 Applying language from WinReg: ${userLanguage}`);
            i18n.changeLanguage(userLanguage);
            setAppSettings((prev) => ({ ...prev, language: userLanguage }));
          }
        });

        // ✅ Fetch Other Settings in Parallel
        const [
          userRefreshRate,
          likeNotifications,
          commentNotifications,
          iniSettings,
        ] = await Promise.all([
          getNotificationRefreshRate(userId),
          getLikeNotifications(userId),
          getCommentNotifications(userId),
          getIniSettings(),
        ]);

        console.log('Loaded INI Settings:', iniSettings);

        // ✅ Apply Notification Settings **Separately**
        setAppSettings((prev) => ({
          ...prev,
          notificationRefreshRate: userRefreshRate || '30s',
          likeNotifications: likeNotifications ?? true,
          commentNotifications: commentNotifications ?? true,
          adminUsername: iniSettings.adminUsername || 'DomV',
          maxUploadSize: iniSettings.maxUploadSize || '10MB',
          tokenExpirationTime: `${iniSettings.tokenExpirationTime}s` || '3600s',
        }));

        console.log('✅ Settings Applied:', {
          darkMode: appSettings.darkMode,
          language: appSettings.language,
          notificationRefreshRate: userRefreshRate,
          likeNotifications,
          commentNotifications,
          adminUsername: iniSettings.adminUsername || 'DomV',
          maxUploadSize: iniSettings.maxUploadSize || '10MB',
          tokenExpirationTime: `${iniSettings.tokenExpirationTime}s` || '3600s',
        });
      } catch (error) {
        console.error('❌ Failed to load settings:', error);
      }
    };

    applySettings();
  }, [userId]);

  return { appSettings, setAppSettings };
};
