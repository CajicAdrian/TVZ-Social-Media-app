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
} from '@chakra-ui/react';
import { MdWbSunny } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';
import { LanguageMenu } from './LanguageMenu';

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
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        minW={'100vw'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('black.200', 'black.900')}
        borderBottomLeftRadius={'25px'}
        borderBottomRightRadius={'25px'}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            marginLeft={'8.5vw'}
          >
            TBD
          </Text>
        </Flex>

        <Box bg={colorMode === 'dark' ? 'gray.800' : 'white.100'} px="5" py="2">
          <Container>
            <Box>
              <Icon as={MdWbSunny} cursor="pointer" onClick={toggleColorMode} />
            </Box>
          </Container>
        </Box>
        <HStack spacing="10" marginRight={'8.5vw'}>
          <Box>
            <LanguageMenu />
          </Box>
          {accessToken ? (
            <LogoutButton />
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
