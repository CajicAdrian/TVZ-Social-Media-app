import { VStack, Spinner, Text, Box, Avatar, Center } from '@chakra-ui/react';
import { AuthContext } from '../components/AuthContext';
import { Layout } from '../components/Layout';
import { Post } from '../components/Post';
import { useAsyncRetry } from 'react-use';
import { getPostsByUser, ApiPost } from 'api';
import React, { useContext, useState } from 'react';

export const Profile = (): JSX.Element => {
  const { user } = useContext(AuthContext); // Fetch logged-in user
  const [error, setError] = useState<string | null>(null);

  const {
    loading,
    value: posts = [],
    retry,
  } = useAsyncRetry<ApiPost[]>(async () => {
    if (!user?.id) {
      throw new Error('User ID is not available');
    }
    try {
      return await getPostsByUser(user.id);
    } catch (err) {
      setError('Failed to fetch posts');
      throw err;
    }
  });

  return (
    <Layout
      leftContent={
        <Center flexDirection="column">
          {/* ✅ Profile Image / Avatar */}
          <Avatar
            size="2xl"
            name={user?.username}
            src={
              user?.profileImage
                ? `http://localhost:3000/${user.profileImage.replace(
                    'static/',
                    '',
                  )}`
                : undefined
            }
            bg="lightblue"
            mb={4} // Spacing below the avatar
          />

          {/* ✅ Username */}
          <Text fontSize="2xl" fontWeight="bold">
            {user?.username}
          </Text>

          {/* ✅ Bio */}
          <Text fontSize="md" color="gray.600" mt={2}>
            {user?.bio || 'No bio available'}
          </Text>
        </Center>
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
                  image={
                    post.images?.[0] ?? {
                      imageId: 0,
                      filePath: '',
                      fileName: '',
                    }
                  }
                  profileImage={post.profileImage} // ✅ No more TS error
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
