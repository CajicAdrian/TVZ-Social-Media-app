import React, { createContext, useContext, useEffect, useState } from 'react';
import { getNotificationsForUser, ApiNotification } from 'api';
import { AuthContext } from './AuthContext';

// ✅ Create Context
interface NotificationsContextType {
  notifications: ApiNotification[];
  loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  loading: false,
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Correct state setup

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotificationsForUser(user.id);
        console.log('📥 Fetched Notifications on Login:', fetchedNotifications);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
      } finally {
        setLoading(false); // ✅ Hide loading spinner when data is loaded
      }
    };

    fetchNotifications();

    console.log('⚡ Connecting to WebSocket...');
    const socket = new WebSocket('ws://localhost:3001');

    socket.onopen = () => console.log('✅ WebSocket Connected to Backend');
    socket.onerror = (error) => console.error('❌ WebSocket Error:', error);
    socket.onclose = () => console.warn('🔴 WebSocket Disconnected');

    socket.onmessage = (event) => {
      console.log('📢 Received WebSocket Message (Raw):', event.data);

      const rawData = JSON.parse(event.data);
      const notification: ApiNotification = JSON.parse(rawData.message);

      console.log('📢 Parsed Notification:', notification);

      setNotifications((prev) => [notification, ...prev]);

      setLoading(false); // ✅ Hide loading when first WebSocket message arrives
    };

    return () => {
      socket.close();
    };
  }, [user]);

  return (
    <NotificationsContext.Provider value={{ notifications, loading }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// ✅ Custom Hook to Use Notifications Anywhere
export const useNotifications = () => useContext(NotificationsContext);
