import React, { ReactElement, useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import {
  getNotifications,
  markNotificationAsRead,
  getNotificationRefreshRate,
} from 'api';
import { FaBell } from 'react-icons/fa';
import { AuthContext } from '../components/AuthContext'; // ✅ Get user ID from AuthContext

// ✅ Notification type (must match API response)
interface ApiNotification {
  id: number;
  type: 'like' | 'comment';
  read: boolean;
  createdAt: string;
  fromUser: {
    id: number;
    username: string;
    profileImage?: string;
  };
  post?: {
    id: number;
    title: string;
  };
}

export const Notifications = (): ReactElement => {
  const { user } = useContext(AuthContext); // ✅ Get logged-in user
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshRate, setRefreshRate] = useState<number>(30000); // ✅ Default to 30s
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // ✅ Store interval reference

  // ✅ Converts "10s" → 10000ms, "30s" → 30000ms, "1min" → 60000ms
  const convertRefreshRateToMs = (rate: string): number => {
    switch (rate) {
      case '10s':
        return 10000;
      case '30s':
        return 30000;
      case '1min':
        return 60000;
      default:
        return 30000;
    }
  };

  // ✅ Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data: ApiNotification[] = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('❌ Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle marking notifications as read
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (err) {
      console.error('❌ Error marking notification as read:', err);
    }
  };

  // ✅ Fetch refresh rate when the component mounts
  useEffect(() => {
    if (!user?.id) return;

    const fetchRefreshRate = async () => {
      try {
        let storedRate = localStorage.getItem('notificationRefreshRate');

        if (!storedRate) {
          storedRate = await getNotificationRefreshRate(user.id);
          localStorage.setItem('notificationRefreshRate', storedRate);
        }

        const newRefreshRate = convertRefreshRateToMs(storedRate);

        if (newRefreshRate !== refreshRate) {
          console.log(
            `🔄 Applying new refresh rate: ${storedRate} (${newRefreshRate}ms)`,
          );
          setRefreshRate(newRefreshRate);
        }
      } catch (error) {
        console.error('❌ Failed to fetch refresh rate:', error);
      }
    };

    fetchRefreshRate();
  }, [user?.id]);

  // ✅ Listen for refresh rate changes from Settings
  useEffect(() => {
    const updateRefreshRate = async () => {
      try {
        const newRate = localStorage.getItem('notificationRefreshRate');
        if (!newRate) return; // ✅ Don't reset if value already exists

        const newRefreshRate = convertRefreshRateToMs(newRate);
        console.log(
          `🔄 Applying new refresh rate: ${newRate} (${newRefreshRate}ms)`,
        );

        setRefreshRate(newRefreshRate);

        if (intervalId) clearInterval(intervalId);
        fetchNotifications(); // ✅ Fetch immediately after change
        const newInterval = setInterval(fetchNotifications, newRefreshRate);
        setIntervalId(newInterval);
      } catch (error) {
        console.error('❌ Failed to apply new refresh rate:', error);
      }
    };

    window.addEventListener('refresh-rate-change', updateRefreshRate);
    return () =>
      window.removeEventListener('refresh-rate-change', updateRefreshRate);
  }, []);

  // ✅ Start Notification Polling
  useEffect(() => {
    if (!refreshRate) return;

    console.log(`⏳ Applying new refresh rate: ${refreshRate}ms`);

    if (intervalId) clearInterval(intervalId);

    fetchNotifications();
    const newInterval = setInterval(fetchNotifications, refreshRate);
    setIntervalId(newInterval);

    return () => {
      console.log('🛑 Clearing old interval');
      clearInterval(newInterval);
    };
  }, [refreshRate]);

  return (
    <Box position="relative">
      {/* ✅ Bell Icon */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        p={0}
        fontSize="xl"
      >
        <FaBell color={isOpen ? 'black' : 'gray'} />
      </Button>

      {/* ✅ Notifications Dropdown */}
      {isOpen && (
        <Box
          position="absolute"
          top="40px"
          right={0}
          w="300px"
          bg="white"
          boxShadow="md"
          borderRadius="md"
          zIndex={10}
          maxH="400px"
          overflowY="auto"
        >
          {loading ? (
            <Spinner size="md" alignSelf="center" mt={4} />
          ) : notifications.length === 0 ? (
            <Text textAlign="center" p={4}>
              No new notifications
            </Text>
          ) : (
            <VStack divider={<Divider />} align="stretch" spacing={0}>
              {notifications.map((notification) => {
                const { fromUser, post, createdAt, id, type, read } =
                  notification;
                const profileImage = fromUser.profileImage
                  ? `http://localhost:3000/${fromUser.profileImage.replace(
                      'static/',
                      '',
                    )}`
                  : undefined;

                return (
                  <HStack
                    key={id}
                    p={3}
                    bg={read ? 'gray.50' : 'white'}
                    _hover={{ bg: 'gray.100' }}
                    cursor="pointer"
                    onClick={() => handleMarkAsRead(id)}
                  >
                    {/* ✅ Avatar with fallback */}
                    <Avatar
                      size="sm"
                      name={fromUser.username}
                      src={profileImage}
                    />

                    <Box>
                      <Text fontWeight="bold">{fromUser.username}</Text>
                      <Text fontSize="sm">
                        {type === 'like'
                          ? `liked your post: "${
                              post?.title || 'Unknown Post'
                            }"`
                          : type === 'comment'
                          ? `commented on your post: "${
                              post?.title || 'Unknown Post'
                            }"`
                          : `followed you`}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(createdAt).toLocaleString()}
                      </Text>
                    </Box>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};
