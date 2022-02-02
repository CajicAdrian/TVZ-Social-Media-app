import React, { useContext } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { login } from 'api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'components';

interface FormData {
  username: string;
  password: string;
}

export const Login = (): JSX.Element => {
  const { handleSubmit, register } = useForm<FormData>({});

  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    if (data.username && data.password) {
      const { accessToken } = await login(data);
      accessToken && setAccessToken(accessToken);
      accessToken && navigate('/');
    }
  };

  return (
    <Flex
      minH={'100vh'}
      minW={'100vw'}
      align={'center'}
      justify={'center'}
      bg={'gray.50'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link>
          </Text>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <FormControl id="username">
                <FormLabel>Username</FormLabel>
                <Input {...register('username', { required: true })} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  {...register('password', { required: true })}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={'blue.400'}>Forgot password?</Link>
                </Stack>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
};
