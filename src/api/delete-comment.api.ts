import { api } from 'api';

export async function deleteComment(postId: number, commentId: number) {
  return api.delete(`/posts/${postId}/comments/${commentId}`);
}
