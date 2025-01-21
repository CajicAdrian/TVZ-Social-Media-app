import React, { ReactElement, useCallback, useContext } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  useColorMode,
  Container,
  HStack,
  Image,
} from '@chakra-ui/react';
import { MdWbSunny } from 'react-icons/md';
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
  const { accessToken } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Box>
      <Flex
        as="nav"
        position="fixed" /* Stays at the top */
        top="0"
        left="0"
        w="100vw"
        h="60px"
        zIndex="10" /* Above the background */
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
        <Notifications />
        <Box bg={colorMode === 'dark' ? 'gray.800' : 'white.100'} px="5" py="2">
          <Container display="flex" alignItems="center">
            {/* User Profile Picture Placeholder */}
            <Box
              as={RouterLink}
              to="/profile" /* Link to profile page */
              borderRadius="full"
              overflow="hidden"
              w="40px"
              h="40px"
              mr="4"
              bg="gray.300" /* Placeholder background color */
              border="2px solid gray"
              cursor="pointer"
            >
              <Image
                src="https://via.placeholder.com/40" /* Placeholder image */
                alt="User Profile"
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>

            {/* Dark Mode Toggle */}
            <Box>
              <Icon as={MdWbSunny} cursor="pointer" onClick={toggleColorMode} />
            </Box>
          </Container>
        </Box>

        <HStack spacing="10" marginRight={'8.5vw'}>
          {accessToken ? (
            <>
              {/* Add the Settings Link when logged in */}
              <Button
                as={RouterLink}
                to="/settings"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                {t('settings')}
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
              >
                {t('sign_in')}
              </Button>
              <Text>/</Text>
              <Button
                fontSize={'sm'}
                fontWeight={400}
                as={RouterLink}
                to="/register"
                variant={'link'}
              >
                {t('sign_up')}
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
