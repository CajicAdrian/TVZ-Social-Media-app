import { api } from "./api"

export const toggleLike = async (postId: number, like: boolean): Promise<void> => {
    if (like) {
        await api.post(`/posts/${postId}/likes`);
    } else {
        await api.delete(`/posts/${postId}/likes`);
    }
}
