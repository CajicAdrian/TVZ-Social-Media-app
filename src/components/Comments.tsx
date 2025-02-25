import {
  Box,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect, useState } from 'react';
import CommentIcon from '../images/Comment.png';
import { CommentsModal } from './CommentsModal';

interface Props {
  postId: number;
  userId: number;
  commentCount: number;
  onChange: () => void;
}

export const Comments = ({
  commentCount,
  postId,
  userId,
  onChange,
}: Props): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCommentCount, setCurrentCommentCount] = useState(commentCount);

  useEffect(() => {
    setCurrentCommentCount(commentCount);
  }, [commentCount]);

  return (
    <>
      <Box
        textAlign="center"
        position="relative"
        display="inline-block"
        onClick={onOpen}
        cursor="pointer"
      >
        <Image src={CommentIcon} alt="Comments" boxSize="48px" />

        <Text
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="gray.700"
          fontWeight="bold"
          fontSize="md"
        >
          {currentCommentCount}
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comments ({currentCommentCount})</ModalHeader>{' '}
          <ModalCloseButton />
          <ModalBody>
            {isOpen && (
              <CommentsModal
                postId={postId}
                userId={userId}
                commentCount={currentCommentCount}
                onChange={onChange}
                onCommentCountChange={setCurrentCommentCount}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
