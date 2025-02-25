import React from 'react';
import { Box, Heading, Container, Text, Stack } from '@chakra-ui/react';
import img from '../images/Home.jpeg';

export const Home = (): JSX.Element => {
  return (
    <>
      <Container
        position="absolute"
        top="-20"
        left="0"
        width="100%"
        height="calc(100vh + 20px)"
        maxW="100vw"
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
            {'Welcome to TBD'} <br />
          </Heading>
          <Text
            color={'black.100'}
            fontFamily={'Ariel'}
            fontSize={{ base: '1xl', sm: '2xl', md: '2xl' }}
          >
            {'Make memories stand out'}
          </Text>
        </Stack>
      </Container>
    </>
  );
};
