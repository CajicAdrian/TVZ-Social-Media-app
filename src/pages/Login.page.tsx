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
import { login } from 'api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'components';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import img from '../images/SignIn.png'; // Adjust the import path as necessary

interface FormData {
  username: string;
  password: string;
}

export const Login = (): JSX.Element => {
  const { t } = useTranslation('login');
  const { handleSubmit, register } = useForm<FormData>({});
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit = async (data: FormData) => {
    if (data.username && data.password) {
      try {
        const { accessToken } = await login(data);
        if (accessToken) {
          setAccessToken(accessToken);
          navigate('/');
        }
      } catch (error) {
        setErrors([t('login_failed', 'Login failed. Please try again.')]);
      }
    }
  };

  return (
    <Flex height="100vh" width="100vw">
      {/* Left Image Section */}
      <Box
        position="absolute" /* Detach the background from layout */
        top="-20" /* Start at the top of the viewport */
        left="0" /* Align to the left */
        width="50vw" /* Cover only the left half of the viewport */
        height="calc(100vh + 20px)"
        bgImage={`url(${img})`} /* Background image */
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        zIndex="-1" /* Keep it behind all content */
      />

      {/* Right Form Section */}
      <Flex
        width="50%" /* Restrict the form to the right half */
        height="100vh" /* Match the viewport height */
        ml="auto" /* Push the form to the right */
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
                {t('welcome_back', 'Welcome back')}
              </Heading>

              <FormControl>
                <FormLabel fontSize="md" fontFamily="'Assistant', sans-serif">
                  {t('username', 'USERNAME')}
                </FormLabel>
                <Input
                  type="text"
                  {...register('username')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius="0"
                  placeholder={t('username_placeholder', 'Enter your username')}
                  fontFamily="'Assistant', sans-serif"
                  fontSize="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontFamily="'Assistant', sans-serif">
                  {t('password', 'PASSWORD')}
                </FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius="0"
                  placeholder={t('password_placeholder', 'Enter your password')}
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
                {t('signin_button', 'Log In')}
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
                  {t('no_account', "Don't have an account?")}
                </Link>
              </Text>
            </VStack>
          </form>
        </Container>
      </Flex>
    </Flex>
  );
};
