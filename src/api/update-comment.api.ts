import { api } from 'api';

export async function updateComment(
  postId: number,
  commentId: number,
  data: { content: string },
) {
  return api.patch(`/posts/${postId}/comments/${commentId}`, data);
}
