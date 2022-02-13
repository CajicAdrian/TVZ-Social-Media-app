import { Box, Button, Spinner, useDisclosure, VStack } from '@chakra-ui/react';
import { createPost, deletePost, getPosts, updatePost, uploadImage } from 'api';
import { Post, PostFormModal } from 'components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsyncRetry } from 'react-use';
import type { ApiPost } from 'src/api/get-posts.api';

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

  const { loading, value = [], retry } = useAsyncRetry(getPosts);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  const openEditModal = (post: ApiPost) => {
    setEdit({
      mode: 'edit',
      postId: post.id,
      data: {
        title: post.title,
        description: post.description,
      },
    });
  };

  const cancelEdit = () => {
    setEdit(null);
  };

  const onSubmit = async (data: FormData) => {
    if (edit?.mode === 'create') {
      if (!data.title || !data.description || !data.image) {
        console.warn('Missing mandator fields to create');
        return;
      }

      const image = await uploadImage(data.image);
      if (!image) {
        throw new Error('Faield to save image');
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
    <Box gridColumn="12 span">
      <VStack spacing="1rem" maxW={'80rem'} mx="auto">
        <Button onClick={openCreateModal}>{t('create_new_post')}</Button>
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
        {loading ? (
          <Spinner />
        ) : (
          value.map((post, idx) => (
            <Post
              title={post.title}
              description={post.description}
              image={post.images[0]}
              key={`key-post-${idx}`}
              onEdit={() => openEditModal(post)}
            />
          ))
        )}
      </VStack>
    </Box>
  );
};
