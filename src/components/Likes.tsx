import { Box, Image, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { toggleLike } from 'api';
import LikeIcon from '../images/Like.png'; // Import the heart image

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
      {/* Heart Image */}
      <Image
        src={LikeIcon}
        alt="Like"
        boxSize={20}
        style={{
          filter: likedByCurrentUser
            ? 'invert(44%) sepia(93%) saturate(6536%) hue-rotate(10deg) brightness(80%) contrast(129%)' // Dark red
            : 'invert(0%) brightness(0%)', // Black
          transition: 'filter 0.3s ease', // Smooth transition
        }}
      />

      {/* Like Count centered inside the heart */}
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
