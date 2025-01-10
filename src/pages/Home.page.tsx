import React from 'react';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import img from '../images/Home.jpeg';

export const Home = (): JSX.Element => {
  const { t } = useTranslation('home');
  return (
    <>
      <Container
        position="absolute"
        top="-20"
        left="0"
        width="100%"
        height="calc(100vh + 20px)"
        maxW="100vw" /* Force maximum width to the viewport */
        zIndex="-1"
        bgImage={`url(${img})`}
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
      >
        <Stack
          as={Box}
          textAlign={'left'}
          margin={'0 0 0 150px'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 80 }}
        >
          <Heading
            fontWeight={600}
            fontFamily={'Ariel'}
            fontSize={{ base: '2xl', sm: '4xl', md: '7xl' }}
            lineHeight={'110%'}
          >
            {t('Welcome to TBD')} <br />
          </Heading>
          <Text
            color={'black.100'}
            fontFamily={'Ariel'}
            fontSize={{ base: '1xl', sm: '2xl', md: '2xl' }}
          >
            {t('Make memories stand out')}
          </Text>
          <Stack
            direction={'row'}
            spacing={3}
            align={'center'}
            alignSelf={'left'}
            position={'relative'}
          >
            <Button
              as={RouterLink}
              to="/register"
              colorScheme={'gray'}
              bg={'white'}
              opacity={'100%'}
              rounded={'full'}
              border={'2px solid white'}
              px={6}
              _hover={{
                bg: 'gray.500',
              }}
            >
              {t('Sign up')}
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme={'gray'}
              bg={'white'}
              rounded={'full'}
              opacity={'70%'}
              border={'2px solid white'}
              px={6}
              _hover={{
                bg: 'gray.500',
              }}
            >
              {t('Log in')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
