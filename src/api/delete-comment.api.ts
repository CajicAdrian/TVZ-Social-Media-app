import { api } from 'api';

export async function deleteComment(postId: number, commentId: number) {
  console.log(
    `🗑️ Sending DELETE request to: /posts/${postId}/comments/${commentId}`,
  );
  return api.delete(`/posts/${postId}/comments/${commentId}`);
}
