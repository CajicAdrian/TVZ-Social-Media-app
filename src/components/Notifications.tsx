import React, { ReactElement, useState, useEffect } from 'react';
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
import { getNotifications, markNotificationAsRead, ApiNotification } from 'api';
import { FaBell } from 'react-icons/fa';

export const Notifications = (): ReactElement => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
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
      console.error('Error marking notification as read:', err);
    }
  };

  // Polling mechanism to refresh notifications every 5 seconds
  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
    const intervalId = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box position="relative">
      {/* Bell Icon */}
      <Button onClick={toggleNotifications} variant="ghost" p={0} fontSize="xl">
        <FaBell color={isOpen ? 'black' : 'gray'} />
      </Button>

      {/* Notifications Dropdown */}
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
              {notifications.map((notification) => (
                <HStack
                  key={notification.id}
                  p={3}
                  bg={notification.read ? 'gray.50' : 'white'}
                  _hover={{ bg: 'gray.100' }}
                  cursor="pointer"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <Avatar size="sm" name={notification.fromUser.username} />
                  <Box>
                    <Text fontWeight="bold">
                      {notification.fromUser.username || 'Unknown User'}
                    </Text>
                    <Text fontSize="sm">
                      {notification.type === 'like'
                        ? `liked your post: "${
                            notification.post?.title || 'Unknown Post'
                          }"`
                        : notification.type === 'comment'
                        ? `commented on your post: "${
                            notification.post?.title || 'Unknown Post'
                          }"`
                        : `followed you`}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};
