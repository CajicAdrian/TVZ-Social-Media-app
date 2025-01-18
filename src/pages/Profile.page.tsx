import React, { useContext, useState } from 'react';
import { VStack, Spinner, Text, Box } from '@chakra-ui/react';
import { AuthContext } from '../components/AuthContext';
import { Layout } from '../components/Layout';
import { Post } from '../components/Post';
import { useAsyncRetry } from 'react-use';
import { getPostsByUser } from 'api';

export const Profile = (): JSX.Element => {
  const { user } = useContext(AuthContext); // Fetch the logged-in user
  const [error, setError] = useState<string | null>(null);

  const {
    loading,
    value: posts = [],
    retry,
  } = useAsyncRetry(async () => {
    if (!user?.id) {
      throw new Error('User ID is not available');
    }
    try {
      return await getPostsByUser(user.id); // Fetch posts by user ID
    } catch (err) {
      setError('Failed to fetch posts');
      throw err;
    }
  });

  return (
    <Layout
      leftContent={
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {user?.username}'s Profile
          </Text>
          <Text>{user?.bio || 'No bio available'}</Text>
        </Box>
      }
      rightContent={
        <VStack spacing={6} align="stretch" w="100%">
          {loading && <Spinner alignSelf="center" />}
          {error && (
            <Text color="red.500" alignSelf="center">
              {error}
            </Text>
          )}
          {!loading && !error && posts.length === 0 && (
            <Text alignSelf="center">No posts available</Text>
          )}
          {!loading && !error && (
            <VStack spacing="1rem">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  title={post.title}
                  description={post.description}
                  image={post.images[0]}
                  username={post.username}
                  commentCount={post.commentCount}
                  likeCount={post.likeCount}
                  likedByCurrentUser={post.likedByCurrentUser}
                  onChange={retry}
                />
              ))}
            </VStack>
          )}
        </VStack>
      }
    />
  );
};
