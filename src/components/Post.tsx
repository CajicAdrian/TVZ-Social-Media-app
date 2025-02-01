import React from 'react';
import {
  Box,
  Center,
  Flex,
  Text,
  Avatar,
  Image,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Likes } from './Likes'; // Import the customized Likes component
import { Comments } from './Comments'; // Import the customized Comments component

interface ImageProps {
  imageId: number;
  filePath: string;
  fileName: string;
}

interface Props {
  postId: number;
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

  return (
    <Center py={6} w="full">
      <Box
        maxW={'40rem'}
        w={'full'}
        bg={'white'}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
        position="relative"
      >
        {/* User Info and Edit Button */}
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
              <Text fontWeight="bold" fontSize="lg">
                {username} - {title}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {description}
              </Text>
            </Box>
          </Flex>
          {onEdit && (
            <Button onClick={onEdit} size="sm" variant="outline">
              {t('edit')}
            </Button>
          )}
        </Flex>

        {/* Image Section */}
        <Box bg={'gray.100'} mx={-6} mb={6} pos={'relative'}>
          <Image
            src={`http://localhost:3000/images/post-images/${image.fileName}`}
            alt="Post image"
            objectFit="cover"
            w="full"
          />

          {/* Likes Component positioned over the image */}
          <Box
            palign="center"
            position="absolute"
            bottom="-60px" // Moved down by increasing the negative value
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

        {/* Comments Section aligned to the left */}
        <Flex justifyContent="flex-start" alignItems="center" mb={4} px={6}>
          <Comments
            postId={postId}
            commentCount={commentCount}
            onChange={onChange}
          />
        </Flex>
      </Box>
    </Center>
  );
}
