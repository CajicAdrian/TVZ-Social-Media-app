import React from 'react';
import {
  Box,
  Center,
  Flex,
  Text,
  Avatar,
  Image,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Likes } from './Likes';
import { Comments } from './Comments';

interface ImageProps {
  imageId: number;
  filePath: string;
  fileName: string;
}

interface Props {
  postId: number;
  userId: number;
  username: string;
  image: ImageProps;
  profileImage?: string;
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
  userId,
  username,
  description,
  image,
  profileImage,
  title,
  commentCount,
  likedByCurrentUser,
  likeCount,
  onEdit,
  onChange,
}: Props): JSX.Element {
  const { t } = useTranslation('feed');

  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Center py={6} w="full">
      <Box
        maxW={'40rem'}
        w={'full'}
        bg={bgColor}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
        position="relative"
      >
        <Flex align="center" p={4} justify="space-between">
          <Flex align="center">
            <Avatar
              size="md"
              name={username}
              src={
                profileImage
                  ? `http://localhost:3000/${profileImage.replace(
                      'static/',
                      '',
                    )}`
                  : undefined
              }
              bg="lightblue"
              mr={4}
            />

            <Box>
              <Text color={textColor} fontWeight="bold" fontSize="lg">
                {username} - {title}
              </Text>
              <Text fontSize="sm" color={textColor}>
                {description}
              </Text>
            </Box>
          </Flex>
          {onEdit && (
            <Box ml="auto">
              <Button onClick={onEdit} size="sm" variant="outline">
                <Text color={textColor}>{t('edit')}</Text>
              </Button>
            </Box>
          )}
        </Flex>

        <Box mx={-6} mb={6} pos={'relative'}>
          <Image
            src={`http://localhost:3000/images/post-images/${image.fileName}`}
            alt="Post image"
            objectFit="cover"
            w="full"
          />

          <Box
            palign="center"
            position="absolute"
            bottom="-60px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
          >
            <Likes
              postId={postId}
              likeCount={likeCount}
              likedByCurrentUser={likedByCurrentUser}
              onChange={onChange}
            />
          </Box>
        </Box>

        <Flex justifyContent="flex-start" alignItems="center" mb={4} px={6}>
          <Comments
            postId={postId}
            userId={userId}
            commentCount={commentCount}
            onChange={onChange}
          />
        </Flex>
      </Box>
    </Center>
  );
}
