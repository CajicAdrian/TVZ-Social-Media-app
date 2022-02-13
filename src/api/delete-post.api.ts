import { api } from './api';

export const deletePost = (postId: number): Promise<void> => {
  return api.delete(`/posts/${postId}`);
};
