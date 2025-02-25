import { api } from './api';

export const toggleLike = async (
  postId: number,
  like: boolean,
): Promise<void> => {
  if (like) {
    await api.post(`/likes/post/${postId}`);
  } else {
    await api.delete(`/likes/posts/${postId}`);
  }
};
