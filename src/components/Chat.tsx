import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  Avatar,
  useOutsideClick,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  getAllUsersExceptMe,
  getMessages,
  sendMessage,
  ApiUser,
  ApiMessage,
} from 'api';
import { useTranslation } from 'react-i18next';

export const Chat = ({ userId }: { userId: number }) => {
  const { t } = useTranslation('feed');
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const bubbleBg = useColorModeValue('blue.100', 'blue.800');
  const bubbleBg2 = useColorModeValue('gray.100', 'gray.800');

  const chatRef = React.useRef(null);

  useOutsideClick({
    ref: chatRef,
    handler: () => {
      if (isOpen) {
        setIsOpen(false);
        setCurrentUser(null);
      }
    },
  });

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && !currentUser) {
      const fetchUsers = async () => {
        const userList = await getAllUsersExceptMe();
        setUsers(userList);
      };
      fetchUsers();
    }
  }, [isOpen, currentUser]);

  const handleUserClick = async (selectedUser: ApiUser) => {
    setCurrentUser(selectedUser);
    const conversationMessages = await getMessages(userId, selectedUser.id);
    setMessages(conversationMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const newMsg = await sendMessage(userId, currentUser.id, newMessage);
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(async () => {
        const updatedMessages = await getMessages(userId, currentUser.id);
        setMessages(updatedMessages);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser, userId]);

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      w="100%"
      zIndex="1000"
      bg={bubbleBg}
      ref={chatRef}
    >
      {!isOpen ? (
        <Button
          w="15%"
          h="50px"
          m={5}
          bg={bgColor}
          color={textColor}
          fontSize="lg"
          onClick={toggleChat}
        >
          {t('chat')}
        </Button>
      ) : (
        <Box h="calc(100vh - 50px)" bg={bgColor} p={4}>
          {!currentUser ? (
            <VStack spacing={2} overflowY="auto" h="100%" alignItems="stretch">
              {users.map((user) => (
                <HStack
                  key={user.id}
                  w="15%"
                  px={4}
                  py={3}
                  bg={bubbleBg}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: 'gray.200' }}
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar
                    name={user.username}
                    src={
                      user.profileImage
                        ? `http://localhost:3000/${user.profileImage.replace(
                            'static/',
                            '',
                          )}`
                        : undefined
                    }
                    bg="lightblue"
                  />
                  <Text fontWeight="bold">{user.username}</Text>
                </HStack>
              ))}
            </VStack>
          ) : (
            <VStack spacing={2} h="100%" alignItems="stretch">
              <Box
                w="15%"
                h="calc(100% - 70px)"
                overflowY="auto"
                bg="gray.50"
                border="1px solid gray"
                borderRadius="md"
                p={0}
              >
                {messages.map((msg) => (
                  <Flex
                    key={msg.id}
                    justify={
                      msg.senderId === userId ? 'flex-end' : 'flex-start'
                    }
                    mb={2}
                  >
                    <Box
                      bg={msg.senderId === userId ? bubbleBg : bubbleBg2}
                      borderRadius="md"
                      p={2}
                      m={2}
                      maxW="70%"
                      wordBreak="break-word"
                      mr={msg.senderId === userId ? '10px' : 'auto'}
                      ml={msg.senderId !== userId ? '10px' : 'auto'}
                    >
                      <Text>{msg.message}</Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
              <HStack w="100%" spacing={2} mt={2}>
                <Input
                  value={newMessage}
                  bg={bubbleBg}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  w="10%"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleSendMessage}
                >
                  {t('send')}
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};
