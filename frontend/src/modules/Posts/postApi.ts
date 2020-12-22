import { transport } from "../../api";
// @ts-ignore
import imageCompression from 'browser-image-compression';
import { PostRequest } from "../../components/Post/Post";
import { AxiosResponse } from "axios";
import { PostObject } from "./postReducer";

const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 960,
    useWebWorker: true
};

export const LIMIT_POSTS_IN_USER_PROFILE = 10;
export const LIMIT_POSTS_BY_HASHTAG = 10;

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
    async getPosts(section: string, offset?: string) {
        return await transport.get('/posts/', {params: {section, offset, limit: LIMIT_POSTS_IN_USER_PROFILE}});
    },
    async getPostsByUser(userIdentifier: string, offset?: string): Promise<AxiosResponse<{userId: string; posts: Array<PostObject>}>> {
        return await transport.get(`/users/${userIdentifier}/posts`, {params: {offset, limit: LIMIT_POSTS_IN_USER_PROFILE}});
    },
    async getPostsByHashtag(hashtag: string, offset?: string) {
        return await transport.get('/posts/', {params: {hashtag, offset, limit: LIMIT_POSTS_BY_HASHTAG}});
    },
    async getPost(postId: string): Promise<AxiosResponse> {
        return await transport.get(`/posts/${postId}`);
    },
    async getPostByPhotoId(photoId: string): Promise<AxiosResponse> {
        return await transport.get(`/photos/${photoId}`);
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

export const transformUrlForPostImage = (url: string): string => {
    return url.replace("/image/upload/", "/image/upload/a_0/");
};