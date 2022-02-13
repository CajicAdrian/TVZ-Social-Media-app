import { api } from './api';

interface UpdatePostInterface {
  title: string;
  description: string;
}

export const updatePost = async (postId: number, changes: Partial<UpdatePostInterface>): Promise<void> => {
  const dataForm = new URLSearchParams();
  if (!changes.title && !changes.description) {
      return; // Nothing changes
  }

  if (changes.title) {
    dataForm.append('title', changes.title);
  }
  if (changes.description) {
    dataForm.append('description', changes.description);
  }

  api.patch(`/posts/${postId}`, dataForm, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
