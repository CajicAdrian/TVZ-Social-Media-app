import React from 'react';
import {
  Box,
  Center,
  Text,
  Stack,
  useColorModeValue,
  Image,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Comments } from './Comments';
import { Likes } from './Likes';

interface Image {
  imageId: number;
  filePath: string;
  fileName: string;
}
interface Props {
  postId: number;
  image: Image;
  title: string;
  description: string;
  commentCount: number;
  likedByCurrentUser: boolean;
  likeCount: number;
  onEdit?: () => void;
  onChange: () => void;
}

export function Post({
  postId,
  description,
  image,
  title,
  commentCount,
  likedByCurrentUser,
  likeCount,
  onEdit,
  onChange,
}: Props): JSX.Element {
  const { t } = useTranslation('feed');

  return (
    <Center py={6} w="full">
      <Box
        maxW={'40rem'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Box bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
          <Image
            src={`http://localhost:3000/images/post-images/${image.fileName}`}
            layout={'fill'}
          />
        </Box>
        <Stack py="2" px="6">
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            {title}
          </Text>
          <Text color={'gray.500'}>{description}</Text>
        </Stack>
        <Flex py="3" px="5" justifyContent="space-between">
          <Likes
            postId={postId}
            likeCount={likeCount}
            likedByCurrentUser={likedByCurrentUser}
            onChange={onChange}
          />
          {onEdit && <Button onClick={onEdit}>{t('edit')}</Button>}
        </Flex>
        <Comments
          postId={postId}
          commentCount={commentCount}
          onChange={onChange}
        />
      </Box>
    </Center>
  );
}
