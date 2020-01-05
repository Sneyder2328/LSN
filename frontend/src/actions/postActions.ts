import {Post, PostResponse} from "../components/Home/NewsFeed/Post";
import {PostApi} from "../api/post";
import {
    CREATE_POST_REQUEST,
    LOAD_POSTS_REQUEST,
    CREATE_POST_ERROR,
    CREATE_POST_SUCCESS,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_ERROR
} from "./types";
import {PostActions, LoadPostsRequest, LoadPostsError} from "../reducers/postReducer";

export const createPost = (postData: Post) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({type: CREATE_POST_REQUEST});
        const response = await PostApi.createPost(postData);
        console.log('new post response=', response);
        dispatch(createPostSuccess(response.data as PostResponse));
    } catch (err) {
        console.log(err);
        dispatch({type: CREATE_POST_ERROR});
    }
};

const createPostSuccess = (postResponse: PostResponse): PostActions => {
    return {
        type: CREATE_POST_SUCCESS,
        postResponse
    };
};

export const loadPosts = () => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch(loadPostsRequest());
        const response = await PostApi.getPosts();
        dispatch({
            type: LOAD_POSTS_SUCCESS,
            posts: response.data
        });
    } catch (err) {
        dispatch(loadPostsError());
    }
};

const loadPostsRequest = (): LoadPostsRequest => {
    return {type: LOAD_POSTS_REQUEST};
};

const loadPostsError = (): LoadPostsError => {
    return {type: LOAD_POSTS_ERROR};
};