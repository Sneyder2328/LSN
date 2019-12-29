import {transport} from "./index";
import {Post} from "../components/Home/NewsFeed/Post";

export const PostApi = {
    async createPost(content: Post) {
        return await transport.post('/posts/', content);
    },
    async getPosts() {
        return await transport.get('/posts/');
    },
    async likePost(postId: string) {
        return await transport.post(`/posts/${postId}/likes`)
    }
};