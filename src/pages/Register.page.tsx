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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'components';
import { signup } from 'api';
import img from '../images/SignIn.png'; // Adjust the import path as necessary

interface FormData {
  username: string;
  password: string;
}

export const Register = (): JSX.Element => {
  const { t } = useTranslation('register');
  const { handleSubmit, register } = useForm<FormData>({});
  const navigate = useNavigate();
  const { setAccessToken } = useContext(AuthContext);
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.username && data.password) {
      setErrors([]);
      const result = await signup(data);
      if (result.status === 'success') {
        setAccessToken(result.accessToken);
        navigate('/');
      } else {
        setErrors(result.messages);
      }
    }
  };

  return (
    <Flex height="100vh" width="100vw">
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
              spacing={8} // Increased spacing between segments
              width="100%"
              maxW="lg"
              marginX="auto"
            >
              <Heading
                as="h2"
                fontSize="2xl" // Adjust this as needed
                mb={6}
                fontFamily="'Karma', serif"
              >
                {t('create_account', 'Create your account')}
              </Heading>

              <FormControl>
                <FormLabel
                  fontSize="md" // Adjust this as needed
                  fontFamily="'Assistant', sans-serif"
                >
                  {t('username', 'USERNAME')}:
                </FormLabel>
                <Input
                  type="username"
                  {...register('username')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius={'0'}
                  placeholder={t('username_placeholder', 'Enter your username')}
                  fontFamily="'Assistant', sans-serif"
                  fontSize="md" // Adjust this as needed
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="md"
                  fontFamily="'Assistant', sans-serif" // Apply Assistant font
                >
                  {t('password', 'PASSWORD')}:
                </FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius={'0'}
                  placeholder={t('password_placeholder', 'Enter your password')}
                  fontFamily="'Assistant', sans-serif" // Apply Assistant font to input
                  fontSize="md" // Adjust this as needed
                />
              </FormControl>
              <Button
                backgroundColor="#97C0E4"
                size="md"
                width="150px"
                borderRadius="12px"
              >
                {t('signup_button', 'Sign Up')}
              </Button>
              {errors.length > 0 && (
                <Text color="red.500">
                  {errors.map((error, index) => (
                    <div key={index}>{t(error)}</div>
                  ))}
                </Text>
              )}
              <Text
                align="center"
                width="150px"
                fontSize="sm"
                mt={4}
                fontFamily="'Assistant', sans-serif"
                color="#97C0E4" // Match the color of the sign-in button
              >
                <RouterLink to="/login" style={{ color: '#97C0E4' }}>
                  {' '}
                  {/* Link to /register */}
                  {t('already_have_account', 'Already have an account?')}
                </RouterLink>
              </Text>
            </VStack>
          </form>
        </Container>
      </Flex>
    </Flex>
  );
};
