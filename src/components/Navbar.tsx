import React, { ReactElement, useCallback, useContext } from 'react';
import {
  Box,
  Flex,
  Button,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  useColorMode,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import { MdSettings, MdDarkMode, MdLightMode } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';
import { Notifications } from './Notifications';

export const LogoutButton = (): ReactElement => {
  const { t } = useTranslation();
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setAccessToken('');
    navigate('/');
  }, [setAccessToken, navigate]);

  return (
    <Button onClick={logout} fontSize={'sm'} fontWeight={600} colorScheme="red">
      {t('logout')}
    </Button>
  );
};

export const Navbar = (): JSX.Element => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { accessToken, user } = useContext(AuthContext); // ✅ Fetch user from AuthContext
  const { t } = useTranslation();

  return (
    <Box>
      <Flex
        as="nav"
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="60px"
        zIndex="10"
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        borderBottom="1px solid"
        borderColor={useColorModeValue('black.200', 'black.900')}
        borderBottomLeftRadius="25px"
        borderBottomRightRadius="25px"
        align="center"
        justify="space-between"
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Button
            as={RouterLink}
            to="/"
            fontSize={'l'}
            fontWeight={400}
            variant={'link'}
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            marginLeft={'8.5vw'}
          >
            {t('TBD')}
          </Button>
        </Flex>

        {accessToken && (
          <HStack
            spacing="4"
            marginRight={'8.5vw'}
            align="center"
            marginLeft={'50px'}
          >
            <Notifications />

            {/* ✅ DARK MODE BUTTON WORKS */}
            <Button onClick={toggleColorMode} variant="ghost">
              {colorMode === 'light' ? (
                <Icon as={MdDarkMode} w={6} h={6} />
              ) : (
                <Icon as={MdLightMode} w={6} h={6} />
              )}
            </Button>

            {/* ✅ FIXED PROFILE IMAGE IN AVATAR */}
            <Box
              as={RouterLink}
              to="/profile"
              borderRadius="full"
              overflow="hidden"
              w="40px"
              h="40px"
              border="2px solid gray"
              cursor="pointer"
            >
              <Avatar
                size="md"
                name={user?.username}
                src={
                  user?.profileImage
                    ? `http://localhost:3000/${user.profileImage.replace(
                        'static/',
                        '',
                      )}`
                    : undefined
                }
                bg="lightblue"
              />
            </Box>

            <Button
              as={RouterLink}
              to="/settings"
              fontSize={'sm'}
              fontWeight={400}
              variant={'link'}
            >
              <Icon as={MdSettings} w={6} h={6} />
            </Button>

            <LogoutButton />
          </HStack>
        )}

        {!accessToken && (
          <HStack spacing="10" marginRight={'8.5vw'}>
            <Button
              as={RouterLink}
              to="/login"
              fontSize={'sm'}
              fontWeight={400}
              variant={'link'}
            >
              {t('sign_in')}
            </Button>
            <Button
              fontSize={'sm'}
              fontWeight={400}
              as={RouterLink}
              to="/register"
              variant={'link'}
            >
              {t('sign_up')}
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};
