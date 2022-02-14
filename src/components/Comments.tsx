import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPaperPlane } from 'react-icons/fa';
import { createComment, ApiComment, getComments } from 'api';
import { useAsync } from 'react-use';

interface Props {
  postId: number;
  commentCount: number;
  onChange: () => void;
}

const CommentsContent = ({ postId, onChange }: Props) => {
  const { t } = useTranslation('feed');

  const { value: comments } = useAsync(() => getComments(postId), [postId]);
  const [content, setContent] = useState('');
  const handleContentChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
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
          <Box key={comment.id} w="full" background="blue.50" p="2" rounded="md">
            <Text as="span" color="gray.500">{comment.user}:</Text>
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
  const { t } = useTranslation('feed');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        w="full"
        variant="ghost"
        roundedTop={0}
        roundedBottom="md"
        onClick={onOpen}
      >
        {commentCount} {t('n_comments')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
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
