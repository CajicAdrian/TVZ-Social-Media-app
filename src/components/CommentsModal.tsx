import {
  Box,
  Divider,
  HStack,
  IconButton,
  Textarea,
  VStack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPaperPlane, FaEdit, FaTrash } from 'react-icons/fa';
import {
  ApiComment,
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from 'api';

interface Props {
  postId: number;
  userId: number;
  commentCount: number; // ✅ Include this to track total comments
  onChange: () => void;
  onCommentCountChange: (count: number) => void; // ✅ Ensure this exists
}

export const CommentsModal = ({
  postId,
  userId,
  onChange,
  onCommentCountChange, // ✅ Add this parameter
}: Props) => {
  const { t } = useTranslation('feed');
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [content, setContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // ✅ Fetch comments and update state
  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
      onCommentCountChange(fetchedComments.length); // ✅ Ensure count updates
    };
    fetchComments();
  }, [postId, onChange]);

  const handleContentChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(ev.target.value);
  };

  const submitComment = async () => {
    if (!content.trim()) return;
    await createComment(postId, content);
    setContent('');
    onChange();
    onCommentCountChange(comments.length + 1); // ✅ Increase count after adding
  };

  const startEditing = (commentId: number, commentText: string) => {
    setEditingCommentId(commentId);
    setEditContent(commentText);
  };

  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;
    await updateComment(postId, commentId, { content: editContent }); // ✅ Pass postId
    setEditingCommentId(null);
    onChange();
  };

  const handleDelete = async (commentId: number) => {
    await deleteComment(postId, commentId); // ✅ Pass postId
    onChange();
  };

  return (
    <>
      <VStack align="stretch">
        {comments?.map((comment) =>
          editingCommentId === comment.id ? (
            <Box
              key={comment.id}
              w="full"
              background="blue.100"
              p="3"
              rounded="md"
            >
              <Text as="span" fontWeight="bold">
                {comment.user.name}
              </Text>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <HStack mt="2">
                <IconButton
                  aria-label="Save"
                  icon={<FaPaperPlane />}
                  size="xs"
                  colorScheme="green"
                  onClick={() => handleUpdate(comment.id)}
                />
                <IconButton
                  aria-label="Cancel"
                  icon={<FaTrash />}
                  size="xs"
                  colorScheme="gray"
                  onClick={() => setEditingCommentId(null)}
                />
              </HStack>
            </Box>
          ) : (
            <Box
              key={comment.id}
              w="full"
              background="blue.50"
              p="3"
              rounded="md"
            >
              <HStack justify="space-between">
                <Text as="span" fontWeight="bold">
                  {comment.user.name}
                </Text>
                {comment.user.id === userId && (
                  <HStack>
                    <IconButton
                      aria-label="Edit"
                      icon={<FaEdit />}
                      size="xs"
                      colorScheme="blue"
                      onClick={() => startEditing(comment.id, comment.content)}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<FaTrash />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => handleDelete(comment.id)}
                    />
                  </HStack>
                )}
              </HStack>
              <Text>{comment.content}</Text>
            </Box>
          ),
        )}
      </VStack>

      <Divider />

      {/* ✅ New Comment Input */}
      <HStack mt="3">
        <Box flex="1 0 auto">
          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder={`${t('action_comment')}...`}
          />
        </Box>
        <Box flex="0 1 auto">
          <IconButton
            aria-label={t('action_comment')}
            icon={<FaPaperPlane />}
            isDisabled={content.length === 0}
            onClick={submitComment}
            colorScheme="blue"
          />
        </Box>
      </HStack>
    </>
  );
};
