import { api } from 'api';

export const toggleCommentLike = async (
  commentId: number,
  like: boolean,
): Promise<void> => {
  if (like) {
    await api.post(`/likes/comments/${commentId}`); // ✅ Match LikesController
  } else {
    await api.delete(`/likes/comments/${commentId}`); // ✅ Match LikesController
  }
};
