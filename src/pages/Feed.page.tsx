import { Box, Button, Spinner, useDisclosure, VStack } from '@chakra-ui/react';
import { createPost, deletePost, getPosts, updatePost, uploadImage } from 'api';
import { Chat, Post, PostFormModal } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsyncRetry } from 'react-use';
import { Layout } from '../components/Layout'; // Import the reusable Layout component
import { AuthContext } from '../components/AuthContext';
import { Navigate } from 'react-router-dom';

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

type EditState =
  | { mode: 'create' }
  | { mode: 'edit'; postId: number; data: Partial<FormData> };

export const Feed = (): JSX.Element => {
  const { t } = useTranslation('feed');
  const [edit, setEdit] = useState<EditState | null>(null);
  const { user } = useContext(AuthContext);

  const { loading, value = [], retry } = useAsyncRetry(getPosts);
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log('📢 Feed Rendering - User:', user);

  if (!user) {
    console.warn('🚨 No user in Feed, redirecting to Home');
    return <Navigate to="/" />;
  }

  const openCreateModal = () => {
    setEdit({ mode: 'create' });
    onOpen();
  };

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
    if (edit?.mode === 'create') {
      if (!data.title || !data.description || !data.image) {
        console.warn('Missing mandatory fields to create');
        return;
      }

      const image = await uploadImage(data.image);
      if (!image) {
        throw new Error('Failed to save image');
      }

      await createPost({
        title: data.title,
        description: data.description,
        imageId: image.imageId,
      });
      retry();
      onClose();
    } else if (edit?.mode === 'edit') {
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
      leftContent={<Box>{user?.id && <Chat userId={user.id} />}</Box>}
      rightContent={
        <VStack spacing={6} align="stretch" w="100%">
          {/* Center the Create New Post Button */}
          <Box display="flex" justifyContent="center">
            <Button onClick={openCreateModal} colorScheme="blue">
              {t('create_new_post')}
            </Button>
          </Box>

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

          {/* Display Posts */}
          {loading ? (
            <Spinner alignSelf="center" />
          ) : (
            <VStack spacing="1rem">
              {value.map((post) => (
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
                  profileImage={post.profileImage} // ✅ Pass profileImage here
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
