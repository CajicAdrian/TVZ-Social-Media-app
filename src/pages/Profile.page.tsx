import React, { useContext, useEffect, useState } from 'react';
import { VStack, Spinner, Text, Box } from '@chakra-ui/react';
import { AuthContext } from '../components/AuthContext';
import { Layout } from '../components/Layout'; // Import the reusable layout
import { Post } from '../components/Post';
import { api } from '../api';

export const Profile = (): JSX.Element => {
  const { user } = useContext(AuthContext); // Access user from context
  const [posts, setPosts] = useState([]); // State for user's posts
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await api.get(`/posts`);
        setPosts(response.data); // Replace with user-specific posts later
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <Layout
      leftContent={
        <>
          <Box
            borderRadius="full"
            overflow="hidden"
            w="100px"
            h="100px"
            bg="gray.300"
            mb="4"
            mx="auto"
          >
            <img
              src={user?.profilePicture || 'https://via.placeholder.com/100'}
              alt={`${user?.username || 'User'}'s avatar`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Text textAlign="center" fontWeight="bold" fontSize="xl">
            {user?.username || 'Guest User'}
          </Text>
          <Text textAlign="center" fontSize="sm" color="gray.200">
            {user?.email || 'No email provided'}
          </Text>
          <Text mt="4" textAlign="center">
            {user?.aboutMe || 'No bio available.'}
          </Text>
        </>
      }
      rightContent={
        <VStack spacing="4" align="stretch">
          {loading ? (
            <Spinner />
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                title={post.title}
                description={post.description}
                image={post.image || 'https://via.placeholder.com/300'} // Fallback for missing images
                likeCount={post.likeCount}
                commentCount={post.commentCount}
              />
            ))
          ) : (
            <Text>No posts available.</Text>
          )}
        </VStack>
      }
    />
  );
};
