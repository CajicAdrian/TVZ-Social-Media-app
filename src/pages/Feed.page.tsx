import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import { Post } from 'components';

export const Feed = (): JSX.Element => {
  return (
    <Box gridColumn="12 span">
      <VStack spacing="1rem" maxW={'80rem'} mx="auto">
        <Text as="h1"> Neki kurac</Text>
        {Array.from(Array(5).keys()).map((_v, idx) => (
          <Post key={`key-post-${idx} `} />
        ))}
      </VStack>
    </Box>
  );
};
