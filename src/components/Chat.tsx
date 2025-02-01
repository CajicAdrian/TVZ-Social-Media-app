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
} from '@chakra-ui/react';
import {
  getAllUsersExceptMe,
  getMessages,
  sendMessage,
  ApiUser,
  ApiMessage,
} from 'api';

export const Chat = ({ userId }: { userId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

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
        try {
          const userList = await getAllUsersExceptMe();
          setUsers(userList);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      };
      fetchUsers();
    }
  }, [isOpen, currentUser]);

  const handleUserClick = async (selectedUser: ApiUser) => {
    setCurrentUser(selectedUser);
    try {
      const conversationMessages = await getMessages(userId, selectedUser.id);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      const newMsg = await sendMessage(userId, currentUser.id, newMessage);
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(async () => {
        try {
          const updatedMessages = await getMessages(userId, currentUser.id);
          setMessages(updatedMessages);
        } catch (error) {
          console.error('Failed to refresh messages:', error);
        }
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
      bg="lightblue"
      ref={chatRef}
    >
      {!isOpen ? (
        <Button
          w="15%"
          h="50px"
          m={5}
          bg="lightblue"
          color="white"
          fontSize="lg"
          onClick={toggleChat}
        >
          Talk to friends
        </Button>
      ) : (
        <Box h="calc(100vh - 50px)" bg="white" p={4}>
          {!currentUser ? (
            <VStack spacing={2} overflowY="auto" h="100%" alignItems="stretch">
              {users.map((user) => (
                <HStack
                  key={user.id}
                  w="15%"
                  px={4}
                  py={2}
                  bg="gray.100"
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
                      bg={msg.senderId === userId ? 'blue.100' : 'gray.100'}
                      borderRadius="md"
                      p={2}
                      maxW="70%"
                      wordBreak="break-word"
                      mr={msg.senderId === userId ? '10px' : 'auto'} // Margin to the right for sender
                      ml={msg.senderId !== userId ? '10px' : 'auto'} // Margin to the left for receiver
                    >
                      <Text>{msg.message}</Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
              <HStack w="100%" spacing={2} mt={2}>
                <Input
                  value={newMessage}
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
                  Send
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};
