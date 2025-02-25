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
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'components';
import { signup, getCurrentUser } from 'api';
import img from '../images/SignIn.png';

interface FormData {
  username: string;
  password: string;
}

export const Register = (): JSX.Element => {
  const { handleSubmit, register } = useForm<FormData>({});
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useContext(AuthContext);
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.username && data.password) {
      setErrors([]);

      const result = await signup(data);

      if (result.status === 'success') {
        const user = await getCurrentUser();
        setAccessToken(result.accessToken);
        setUser(user);

        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        await new Promise((resolve) => setTimeout(resolve, 100));

        navigate('/');
      } else {
        setErrors(result.messages);
      }
    }
  };

  return (
    <Flex height="100vh" width="100vw">
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
                {'Create your account'}
              </Heading>

              <FormControl>
                <FormLabel fontSize="md" fontFamily="'Assistant', sans-serif">
                  {'Username'}:
                </FormLabel>
                <Input
                  type="username"
                  {...register('username')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius={'0'}
                  placeholder={'Enter your username'}
                  fontFamily="'Assistant', sans-serif"
                  fontSize="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontFamily="'Assistant', sans-serif">
                  {'Password'}:
                </FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                  variant="unstyled"
                  borderBottom="1px solid black"
                  borderRadius={'0'}
                  placeholder={'Enter your password'}
                  fontFamily="'Assistant', sans-serif"
                  fontSize="md"
                />
              </FormControl>
              <Button
                type="submit"
                backgroundColor="#97C0E4"
                size="md"
                width="150px"
                borderRadius="12px"
              >
                {'Sign Up'}
              </Button>
              {Array.isArray(errors) && errors.length > 0 && (
                <Text color="red.500">
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </Text>
              )}
              <Text
                align="center"
                width="150px"
                fontSize="sm"
                mt={4}
                fontFamily="'Assistant', sans-serif"
                color="#97C0E4"
              >
                <RouterLink to="/login" style={{ color: '#97C0E4' }}>
                  {' '}
                  {'Already have an account?'}
                </RouterLink>
              </Text>
            </VStack>
          </form>
        </Container>
      </Flex>
    </Flex>
  );
};
