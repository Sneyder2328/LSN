import {transport} from "../../api";

export type CommentRequest = {
    postId: string;
    id: string;
    type: 'text' | 'img';
    text: string;
    img?: string;
};

const LIMIT_COMMENTS_PER_POST = 10
export const CommentApi = {
    async createComment(comment: CommentRequest) {
        return await transport.post(`/posts/${comment.postId}/comments`, comment);
    },
    async getComments(postId: string, offset?: string) {
        return await transport.get(`/posts/${postId}/comments`, {params: {limit: LIMIT_COMMENTS_PER_POST, offset}});
    },
    async likeComment(commentId: string) {
        return await transport.post(`/comments/${commentId}/likes`)
    },
    async unlikeComment(commentId: string) {
        return await transport.delete(`/comments/${commentId}/likes`)
    },
    async dislikeComment(commentId: string) {
        return await transport.post(`/comments/${commentId}/dislikes`)
    },
    async undislikeComment(commentId: string) {
        return await transport.delete(`/comments/${commentId}/dislikes`)
    }
};