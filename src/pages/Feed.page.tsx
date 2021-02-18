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

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

export const Feed = (): JSX.Element => {
  const { handleSubmit, register } = useForm({});

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
        <Button onClick={onOpen}>Create a new Post</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
                  <Stack spacing={4}>
                    <FormControl id="title">
                      <FormLabel>Title:</FormLabel>
                      <Input
                        name="title"
                        type="text"
                        ref={register({ required: true })}
                      />
                    </FormControl>
                    <FormControl id="description">
                      <FormLabel>Description:</FormLabel>
                      <Input
                        name="description"
                        type="text"
                        ref={register({ required: true })}
                      />
                    </FormControl>
                    <FormControl id="image">
                      <FormLabel>Image u want to upload:</FormLabel>
                      <Input
                        name="image"
                        type="file"
                        ref={register({ required: true })}
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
                        And send!
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
