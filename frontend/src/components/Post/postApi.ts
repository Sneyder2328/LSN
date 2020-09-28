import {transport} from "../../api";
import {PostRequest} from "./Post";
// @ts-ignore
import imageCompression from 'browser-image-compression';

const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 960,
    useWebWorker: true
};

export const PostApi = {
    async createPost(content: PostRequest) {
        return await transport.post('/posts/', content);
    },
    async createPostWithImage(content: PostRequest) {
        console.log("createPostWithImage", content);
        const formData = new FormData();
        // @ts-ignore
        const images = await Promise.all(content.imageFiles.map((imgFile): File => (imageCompression(imgFile, options))));
        images.forEach((imageFile) => {
            formData.append('image', imageFile);
        });
        formData.append('text', content.text);
        formData.append('id', content.id);
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