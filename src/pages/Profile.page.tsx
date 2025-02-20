import {
  VStack,
  Spinner,
  Text,
  Avatar,
  Center,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { Post } from '../components/Post';
import { useAsyncRetry } from 'react-use';
import {
  getPostsByUser,
  getCurrentUser,
  ApiPost,
  updatePost,
  deletePost,
} from 'api';
import React, { useEffect, useState } from 'react';
import { PostFormModal } from 'components';

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

type EditState =
  | { mode: 'create' }
  | { mode: 'edit'; postId: number; data: Partial<FormData> };

export const Profile = (): JSX.Element => {
  const [user, setUser] = useState<{
    id: number;
    username: string;
    profileImage?: string;
    bio?: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue('black', 'white'); // Text color

  // ✅ Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser(); // ✅ Fetch from API
        setUser(fetchedUser);
      } catch (err) {
        console.error('❌ Failed to fetch user:', err);
        setError('Failed to load user profile');
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch posts only when user is available
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
  }, [user?.id]); // ✅ Dependency added to re-fetch if user ID changes

  useEffect(() => {
    if (edit) {
      onOpen();
    } else {
      onClose();
    }
  }, [edit]);

  const cancelEdit = () => {
    setEdit(null);
  };

  const onSubmit = async (data: FormData) => {
    if (edit?.mode === 'edit') {
      await updatePost(edit.postId, data);
      onClose();
      retry();
    }
  };

  const onDelete = async () => {
    if (edit?.mode !== 'edit') {
      throw new Error("Can't delete post, not editing");
    }

    await deletePost(edit.postId);
    onClose();
    retry();
  };

  return (
    <Layout
      leftContent={
        <Center flexDirection="column">
          {/* ✅ Ensure `user` is loaded before rendering */}
          {user ? (
            <>
              {/* ✅ Profile Image / Avatar */}
              <Avatar
                size="2xl"
                name={user.username}
                src={
                  user.profileImage
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
              <Text color={textColor} fontSize="2xl" fontWeight="bold">
                {user.username}
              </Text>

              {/* ✅ Bio */}
              <Text fontSize="md" color={textColor} mt={2}>
                {user.bio || 'No bio available'}
              </Text>
            </>
          ) : (
            <Spinner size="lg" />
          )}
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
          {/* Post Form Modal */}
          {edit && (
            <PostFormModal
              mode={edit.mode}
              isOpen={isOpen}
              onClose={cancelEdit}
              value={edit.mode === 'edit' ? edit.data : {}}
              onSubmit={onSubmit}
              onDelete={onDelete}
            />
          )}
          {!loading && !error && (
            <VStack spacing="1rem">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  postId={post.id}
                  userId={user?.id || 0}
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
                  onEdit={() =>
                    setEdit({ mode: 'edit', postId: post.id, data: post })
                  } // ✅ This enables the Edit button
                />
              ))}
            </VStack>
          )}
        </VStack>
      }
    />
  );
};
