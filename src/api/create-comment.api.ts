import { api } from './api';

export const createComment = async (postId: number, comment: string): Promise<void> => {
  const dataForm = new URLSearchParams();

  dataForm.append('content', comment);

  api.post(`/posts/${postId}/comments`, dataForm, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
