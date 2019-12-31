import {transport} from "./index";

export type CommentRequest = {
    postId: string;
    id: string;
    type: 'text'|'img';
    text: string;
    img?: string;
};

export const CommentApi = {
    async createComment(comment: CommentRequest) {
        return await transport.post(`/posts/${comment.postId}/comments`, comment);
    }
};