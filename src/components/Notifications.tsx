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
import { FaBell } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../components/NotificationsContext';

export const Notifications = (): ReactElement => {
  const { t } = useTranslation();
  const { notifications, loading } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box position="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        p={0}
        fontSize="xl"
      >
        <FaBell color={isOpen ? 'black' : 'gray'} />
      </Button>

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
              {t('No new notifications')}
            </Text>
          ) : (
            <VStack divider={<Divider />} align="stretch" spacing={0}>
              {notifications.map((notification) => {
                const { fromUser, postTitle, createdAt, id, type } =
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
                    bg={'white'}
                    _hover={{ bg: 'gray.100' }}
                    cursor="default"
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
                          ? `liked your post: "${postTitle || 'Unknown Post'}"`
                          : type === 'comment'
                          ? `commented on your post: "${
                              postTitle || 'Unknown Post'
                            }"`
                          : `liked your comment on "${
                              postTitle || 'Unknown Post'
                            }"`}
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
