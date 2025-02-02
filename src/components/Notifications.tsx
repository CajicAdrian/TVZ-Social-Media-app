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
import { getNotifications, markNotificationAsRead } from 'api';
import { FaBell } from 'react-icons/fa';

// ✅ Define the expected notification type (assuming this matches your API response)
interface ApiNotification {
  id: number;
  type: 'like' | 'comment' | 'follow';
  read: boolean;
  createdAt: string;
  fromUser: {
    id: number;
    username: string;
    profileImage?: string; // ✅ Optional in case there's no image
  };
  post?: {
    id: number;
    title: string;
  };
}

export const Notifications = (): ReactElement => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]); // ✅ Correctly typed state
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data: ApiNotification[] = await getNotifications();
      setNotifications(data); // ✅ No TypeScript error now
    } catch (err) {
      console.error('Error fetching notifications:', err);
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
      console.error('Error marking notification as read:', err);
    }
  };

  // ✅ Fetch notifications on component mount & poll every 5s
  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
                  : undefined; // ✅ Use profile image if available

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
