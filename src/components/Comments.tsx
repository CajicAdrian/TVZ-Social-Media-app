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
import React, { ReactElement, useState } from 'react';
import CommentIcon from '../images/Comment.png'; // Import the comment bubble image
import { CommentsModal } from './CommentsModal'; // ✅ Import the new component

interface Props {
  postId: number;
  userId: number;
  commentCount: number; // ✅ Initial comment count
  onChange: () => void;
}

export const Comments = ({
  commentCount,
  postId,
  userId,
  onChange,
}: Props): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCommentCount, setCurrentCommentCount] = useState(commentCount); // ✅ Track count in state

  return (
    <>
      {/* Image displayed before triggering the modal */}
      <Box
        textAlign="center"
        position="relative"
        display="inline-block"
        onClick={onOpen}
        cursor="pointer"
      >
        {/* Comment Bubble Image */}
        <Image src={CommentIcon} alt="Comments" boxSize="48px" />

        {/* Comment Count centered inside the bubble */}
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

      {/* Modal that appears after clicking the image */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comments ({currentCommentCount})</ModalHeader>{' '}
          {/* ✅ Show updated count */}
          <ModalCloseButton />
          <ModalBody>
            {isOpen && (
              <CommentsModal
                postId={postId}
                userId={userId}
                commentCount={currentCommentCount} // ✅ Pass comment count
                onChange={onChange}
                onCommentCountChange={setCurrentCommentCount} // ✅ Ensure this is passed correctly
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
