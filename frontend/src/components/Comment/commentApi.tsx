import {transport} from "../../api";

export type CommentRequest = {
    postId: string;
    id: string;
    type: 'text' | 'img';
    text: string;
    img?: string;
};

export const CommentApi = {
    async createComment(comment: CommentRequest) {
        return await transport.post(`/posts/${comment.postId}/comments`, comment);
    },
    async getComments(postId: string, offset: number, limit: number) {
        return await transport.get(`/posts/${postId}/comments`, {params: {offset, limit}});
    }
};