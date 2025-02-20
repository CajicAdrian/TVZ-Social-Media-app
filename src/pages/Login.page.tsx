import React, { useContext, useState } from 'react';
import {
  Flex,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Container,
  Link,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { login, getWinSettings } from 'api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'components';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import img from '../images/SignIn.png';
import { useColorMode } from '@chakra-ui/react';

interface FormData {
  username: string;
  password: string;
}

export const Login = (): JSX.Element => {
  const { i18n } = useTranslation('login');
  const { colorMode, toggleColorMode } = useColorMode();
  const { handleSubmit, register } = useForm<FormData>({});
  const { setAccessToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);

  console.log('🔍 Inside Login.tsx - Current AuthContext:', {
    setAccessToken,
    setUser,
  });
  const onSubmit = async (data: FormData) => {
    if (!setAccessToken || !setUser) {
      console.error(
        '❌ AuthContext is missing. Ensure <AuthProvider> is wrapping <Login />.',
      );
      return;
    }

    try {
      const { accessToken, user } = await login(data);
      if (!accessToken || !user)
        throw new Error('❌ Login failed: Missing accessToken or user');

      console.log('🚀 Setting user & token in AuthContext:', {
        accessToken,
        user,
      });

      setAccessToken(accessToken);
      setUser(user);

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Fetch and apply ALL user settings immediately after login
      const settings = await getWinSettings(user.id);
      console.log('⚙️ Applying user settings:', settings);

      // ✅ Apply Language
      i18n.changeLanguage(settings.language);

      // ✅ Apply Dark Mode
      if (settings.darkMode && colorMode !== 'dark') toggleColorMode();
      if (!settings.darkMode && colorMode !== 'light') toggleColorMode();

      // ✅ Apply Notification Settings
      localStorage.setItem(
        'likeNotifications',
        String(settings.likeNotifications),
      );
      localStorage.setItem(
        'commentNotifications',
        String(settings.commentNotifications),
      );
      localStorage.setItem(
        'notificationRefreshRate',
        settings.notificationRefreshRate,
      );
      window.dispatchEvent(new Event('refresh-rate-change'));

      setTimeout(() => {
        navigate('/');
      }, 300);
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      setErrors(['Login failed. Please try again.']);
    }
  };

  return (
    <Flex height="100vh" width="100vw">
      {/* Left Image Section */}
      <Box
        position="absolute"
        top="-20"
        left="0"
        width="50vw"
        height="calc(100vh + 20px)"
        bgImage={`url(${img})`}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        zIndex="-1"
      />

      {/* Right Form Section */}
      <Flex
        width="50%"
        height="100vh"
        ml="auto"
        direction="column"
        justify="center"
        align="center"
        p={8}
      >
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack
              align="start"
              spacing={8}
              width="100%"
              maxW="lg"
              marginX="auto"
            >
              <Heading
                as="h2"
                fontSize="2xl"
                mb={6}
                fontFamily="'Karma', serif"
              >
                {'Welcome back'}
              </Heading>

              <FormControl>
                <FormLabel fontSize="md" fontFamily="'Assistant', sans-serif">
                  {'Username'}
                </FormLabel>
                <Input
                  type="text"
                  {...register('username')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius="0"
                  placeholder={'Enter your username'}
                  fontFamily="'Assistant', sans-serif"
                  fontSize="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontFamily="'Assistant', sans-serif">
                  {'Password'}
                </FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius="0"
                  placeholder={'Enter your password'}
                  fontFamily="'Assistant', sans-serif"
                  fontSize="md"
                />
              </FormControl>

              <Button
                backgroundColor="#97C0E4"
                size="md"
                width="150px"
                borderRadius="12px"
                type="submit"
              >
                {'Log In'}
              </Button>
              {errors.length > 0 && (
                <Text color="red.500" fontFamily="'Assistant', sans-serif">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </Text>
              )}

              {/* Don't have an account link */}
              <Text
                align="center"
                width="150px"
                fontSize="sm"
                mt={4}
                fontFamily="'Assistant', sans-serif"
                color="#97C0E4"
              >
                <Link as={RouterLink} to="/register" color="#97C0E4">
                  {"Don't have an account?"}
                </Link>
              </Text>
            </VStack>
          </form>
        </Container>
      </Flex>
    </Flex>
  );
};
