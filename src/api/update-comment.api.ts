import { api } from 'api';

export async function updateComment(
  postId: number, // ✅ Add postId as a required parameter
  commentId: number,
  data: { content: string },
) {
  console.log(
    `✏️ Sending PATCH request to: /posts/${postId}/comments/${commentId}`,
  );
  return api.patch(`/posts/${postId}/comments/${commentId}`, data);
}
