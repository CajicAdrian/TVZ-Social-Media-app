import React, { createContext, useContext, useEffect, useState } from 'react';
import { getNotificationsForUser, ApiNotification } from 'api';
import { AuthContext } from './AuthContext';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotificationsForUser(user.id);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const socket = new WebSocket('ws://localhost:3001');

    socket.onmessage = (event) => {
      const rawData = JSON.parse(event.data);
      const notification: ApiNotification = JSON.parse(rawData.message);
      setNotifications((prev) => [notification, ...prev]);

      setLoading(false);
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

export const useNotifications = () => useContext(NotificationsContext);
