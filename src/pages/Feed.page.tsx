import React from 'react';
import {
  Box,
  VStack,
  Spinner,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Post } from 'components';
import { useAsyncRetry } from 'react-use';
import { getPosts } from 'api';
import { useForm } from 'react-hook-form';
import { createPost, uploadImage } from 'api';
import { useTranslation } from 'react-i18next';

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

export const Feed = (): JSX.Element => {
  const { t } = useTranslation('feed');
  const { handleSubmit, register } = useForm<FormData>({});

  const { loading, value = [], retry } = useAsyncRetry(getPosts);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async (data: FormData) => {
    if (data.title && data.description && data.image) {
      const image = await uploadImage(data.image);
      if (image) {
        createPost({
          title: data.title,
          description: data.description,
          imageId: image.imageId,
        }).then(async () => {
          await retry();
          onClose();
        });
      }
    }
  };

  return (
    <Box gridColumn="12 span">
      <VStack spacing="1rem" maxW={'80rem'} mx="auto">
        <Button onClick={onOpen}>{t('create_new_post')}</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                  <Stack spacing={4}>
                    <FormControl id="title">
                      <FormLabel>{t('title')}:</FormLabel>
                      <Input
                        type="text"
                        {...register('title', { required: true })}
                      />
                    </FormControl>
                    <FormControl id="description">
                      <FormLabel>{t('description')}:</FormLabel>
                      <Input
                        type="text"
                        {...register('description', { required: true })}
                      />
                    </FormControl>
                    <FormControl id="image">
                      <FormLabel>{t('image')}:</FormLabel>
                      <Input
                        type="file"
                        {...register('image', { required: true })}
                      />
                    </FormControl>
                    <Stack spacing={10}>
                      <Button
                        type="submit"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                      >
                        {t('send')}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
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
