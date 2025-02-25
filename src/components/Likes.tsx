import { Box, Image, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { toggleLike } from 'api';
import LikeIcon from '../images/Like.png';

interface Props {
  postId: number;
  likedByCurrentUser: boolean;
  likeCount: number;
  onChange: () => void;
}

export const Likes = ({
  postId,
  likedByCurrentUser,
  likeCount,
  onChange,
}: Props): ReactElement => {
  const onLike = async () => {
    await toggleLike(postId, !likedByCurrentUser);
    onChange();
  };

  return (
    <Box
      textAlign="center"
      position="relative"
      display="inline-block"
      onClick={onLike}
      cursor="pointer"
    >
      <Image
        src={LikeIcon}
        alt="Like"
        boxSize={20}
        style={{
          filter: likedByCurrentUser
            ? 'invert(44%) sepia(93%) saturate(6536%) hue-rotate(10deg) brightness(80%) contrast(129%)'
            : 'invert(0%) brightness(0%)',
          transition: 'filter 0.3s ease',
        }}
      />

      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color={likedByCurrentUser ? 'gray.700' : 'white'}
        fontWeight="bold"
        fontSize="md"
      >
        {likeCount}
      </Text>
    </Box>
  );
};
