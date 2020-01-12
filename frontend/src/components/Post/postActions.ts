import {Post, PostResponse} from "./Post";
import {PostApi} from "./postApi";
import {
    CREATE_POST_REQUEST,
    LOAD_POSTS_REQUEST,
    CREATE_POST_ERROR,
    CREATE_POST_SUCCESS,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_ERROR
} from "../../actions/types";
import {PostActions, LoadPostsRequest, LoadPostsError} from "./postReducer";
import {normalize, schema} from "normalizr";

export const createPost = (postData: Post) => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch({type: CREATE_POST_REQUEST});
        const response = await PostApi.createPost(postData);
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

const user = new schema.Entity('users', {}, {
    idAttribute: "userId"
});
const comment = new schema.Entity('comments', {
    authorProfile: user
});
const post = new schema.Entity('posts', {
    authorProfile: user,
    comments: [comment]
});


export const loadPosts = () => async (dispatch: (actions: PostActions) => any) => {
    try {
        dispatch(loadPostsRequest());
        const response = await PostApi.getPosts();
        const normalizedData = normalize(response.data, [post]);
        console.log('normalizedData=', normalizedData);
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