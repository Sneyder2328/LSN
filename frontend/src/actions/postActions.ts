import {Post, PostResponse} from "../components/Home/NewsFeed/Post";
import {PostApi} from "../api/post";
import {
    CLEAN_POST_CREATED_STATUS,
    CREATING_POST,
    FETCHING_POSTS,
    POST_CREATED_ERROR,
    POST_CREATED_SUCCESS,
    POSTS_FETCHED
} from "./types";
import {PostActions} from "../reducers/postReducer";

export const createPost = (postData: Post) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({type: CREATING_POST});
        const response = await PostApi.createPost(postData);
        console.log('new post response=', response);
        dispatch(postCreatedSuccess(response.data as PostResponse));
    } catch (err) {
        console.log(err);
        dispatch({type: POST_CREATED_ERROR});
    }
};

export const fetchPosts = () => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({type: FETCHING_POSTS});
        const response = await PostApi.getPosts();
        dispatch({
            type: POSTS_FETCHED,
            posts: response.data
        });
    } catch (err) {

    }
};

const postCreatedSuccess = (postResponse: PostResponse): PostActions => {
    return {
        type: POST_CREATED_SUCCESS,
        postResponse
    };
};

export const cleanCreatePostStatus = (): PostActions => {
    return {
        type: CLEAN_POST_CREATED_STATUS
    };
};