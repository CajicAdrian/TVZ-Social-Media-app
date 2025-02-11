import { useEffect, useState } from 'react';
import {
  getNotificationRefreshRate,
  getUserTheme,
  getUserLanguage,
  getLikeNotifications,
  getCommentNotifications,
} from 'api';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@chakra-ui/react';

export const useAppSettings = (userId?: number) => {
  const { i18n } = useTranslation();
  const { setColorMode } = useColorMode();

  // ✅ State for settings
  const [settings, setSettings] = useState({
    language: 'en',
    darkMode: 'light',
    notificationRefreshRate: '30s',
    likeNotifications: true,
    commentNotifications: true,
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
          setSettings((prev) => ({ ...prev, darkMode: theme }));
        });

        // ✅ Fetch Language & Apply Immediately
        getUserLanguage(userId).then((userLanguage) => {
          if (userLanguage) {
            console.log(`🌍 Applying language from WinReg: ${userLanguage}`);
            i18n.changeLanguage(userLanguage);
            setSettings((prev) => ({ ...prev, language: userLanguage }));
          }
        });

        // ✅ Fetch Other Settings in Parallel
        const [userRefreshRate, likeNotifications, commentNotifications] =
          await Promise.all([
            getNotificationRefreshRate(userId),
            getLikeNotifications(userId),
            getCommentNotifications(userId),
          ]);

        // ✅ Apply Notification Settings **Separately**
        setSettings((prev) => ({
          ...prev,
          notificationRefreshRate: userRefreshRate || '30s',
          likeNotifications,
          commentNotifications,
        }));

        console.log('✅ Settings Applied:', {
          darkMode: settings.darkMode,
          language: settings.language,
          notificationRefreshRate: userRefreshRate,
          likeNotifications,
          commentNotifications,
        });
      } catch (error) {
        console.error('❌ Failed to load settings:', error);
      }
    };

    applySettings();
  }, [userId]);

  return { settings };
};
