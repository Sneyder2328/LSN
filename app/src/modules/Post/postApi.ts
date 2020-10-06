import {transport} from "../api";
import {PostRequest} from "./postsReducer";

export const PostApi = {
    async createPost(content: PostRequest) {
        return await transport.post('/posts/', content);
    },
    async createPostWithImage(content: PostRequest) {
        console.log("createPostWithImage", content);
        const formData = new FormData();

        const images = content.imageFiles //await Promise.all(content.imageFiles.map((imgFile): File => (imageCompression(imgFile, options))));
        images.forEach((imageFile) => {
            // @ts-ignore
            formData.append('image', imageFile);
        });
        formData.append('text', content.text);
        formData.append('id', content.id);
        console.log('formData passed=', formData);
        return await transport.post('/imageposts/', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    },
    async getPosts() {
        return await transport.get('/posts/');
    },
    async likePost(postId: string) {
        return await transport.post(`/posts/${postId}/likes`)
    },
    async unlikePost(postId: string) {
        return await transport.delete(`/posts/${postId}/likes`)
    },
    async dislikePost(postId: string) {
        return await transport.post(`/posts/${postId}/dislikes`)
    },
    async undislikePost(postId: string) {
        return await transport.delete(`/posts/${postId}/dislikes`)
    }
};