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
  VStack,
  Divider,
  HStack,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import CommentIcon from '../images/Comment.png'; // Import the comment bubble image
import { createComment, getComments } from 'api';
import { useAsync } from 'react-use';
import { FaPaperPlane } from 'react-icons/fa';

interface Props {
  postId: number;
  commentCount: number;
  onChange: () => void;
}

const CommentsContent = ({ postId, onChange }: Props) => {
  const { t } = useTranslation('feed');
  const { value: comments } = useAsync(() => getComments(postId), [postId]);
  const [content, setContent] = React.useState('');

  const handleContentChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(ev.target.value);
  };

  const submitComment = async () => {
    if (!content) {
      throw new Error('Tried to submit empty comment');
    }

    await createComment(postId, content);
    onChange();
  };

  return (
    <>
      <VStack>
        {comments?.map((comment) => (
          <Box
            key={comment.id}
            w="full"
            background="blue.50"
            p="2"
            rounded="md"
          >
            <Text as="span" color="gray.500">
              {comment.user}:
            </Text>
            <br />
            {comment.content}
          </Box>
        ))}
      </VStack>
      <Divider />
      <HStack mt="3">
        <Box flex="1 0 auto">
          <Textarea
            value={content}
            onChange={handleContentChange}
            lines="3"
            placeholder={`${t('action_comment')}...`}
          />
        </Box>
        <Box flex="0 1 auto">
          <IconButton
            aria-label={t('action_comment')}
            icon={<FaPaperPlane />}
            isDisabled={content.length === 0}
            onClick={submitComment}
          />
        </Box>
      </HStack>
    </>
  );
};

export const Comments = ({
  commentCount,
  postId,
  onChange,
}: Props): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          {commentCount}
        </Text>
      </Box>

      {/* Modal that appears after clicking the image */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comments</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isOpen && (
              <CommentsContent
                commentCount={commentCount}
                postId={postId}
                onChange={onChange}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
