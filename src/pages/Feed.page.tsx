import React from 'react';
import { Box, VStack, Text, Spinner } from '@chakra-ui/react';
import { Post } from 'components';
import { useAsyncRetry } from 'react-use';
import { getPosts } from 'api';

export const Feed = (): JSX.Element => {
  const { loading, value = [], retry } = useAsyncRetry(getPosts);

  return (
    <Box gridColumn="12 span">
      <VStack spacing="1rem" maxW={'80rem'} mx="auto">
        <Text as="h1"> Posts</Text>
        {loading ? (
          <Spinner />
        ) : (
          value.map((post, idx) => (
            <Post
              title={post.title}
              description={post.description}
              image={post.images[0]}
              key={`key-post-${idx} `}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};
