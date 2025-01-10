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
      <Image src={LikeIcon} alt="Like" boxSize={20} />

      {/* Like Count centered inside the heart */}
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="gray.700"
        fontWeight="bold"
        fontSize="md"
      >
        {likeCount}
      </Text>
    </Box>
  );
};
