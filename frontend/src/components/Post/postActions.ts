import {PostRequest} from "./Post";
import {PostApi} from "./postApi";
import {
    CREATE_POST_REQUEST,
    LOAD_POSTS_REQUEST,
    CREATE_POST_ERROR,
    CREATE_POST_SUCCESS,
    LOAD_POSTS_SUCCESS,
    LOAD_POSTS_ERROR, INTERACT_POST_REQUEST, INTERACT_POST_ERROR, INTERACT_POST_SUCCESS
} from "../../actions/types";
import {LoadPostsError, LoadPostsRequest, PostActions, PostObject} from "./postReducer";
import {normalize} from "normalizr";
import {post} from "../../api/schema";
import {setUsers} from "../User/userActions";
import {HashTable} from "../../utils/utils";
import {UserObject} from "../User/userReducer";
import {Actions} from "../../reducers";
import {setComments} from "../Comment/commentActions";
import {CommentObject} from "../Comment/commentReducer";

export const createPost = (postData: PostRequest) => async (dispatch: (actions: PostActions) => any) => {
    try {
        console.log('createPost', postData);
        dispatch({
            type: CREATE_POST_REQUEST,
            payload: {
                postId: postData.id,
                text: postData.text,
                imageFiles: postData.imageFiles,
                userId: postData.userId
            }
        });
        const response = postData.imageFiles.length !== 0 ? await PostApi.createPostWithImage(postData) : await PostApi.createPost(postData);
        const normalizedData = normalize(response.data, post);
        console.log('normalized create post', normalizedData);
        dispatch(createPostSuccess(normalizedData.entities['posts'][response.data.id] as PostObject));
    } catch (err) {
        console.log(err);
        dispatch({
            type: CREATE_POST_ERROR,
            error: 'Error creating post'
        });
    }
};

const createPostSuccess = (postResponse: PostObject): PostActions => {
    return {
        type: CREATE_POST_SUCCESS,
        postCreated: postResponse
    };
};


export const loadPosts = () => async (dispatch: (actions: Actions) => any) => {
    try {
        dispatch(loadPostsRequest('latest'));
        const response = await PostApi.getPosts();
        const normalizedData = normalize(response.data, [post]);
        console.log('normalizedData=', normalizedData);
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setComments(normalizedData.entities['comments'] as HashTable<CommentObject>));
        dispatch({
            type: LOAD_POSTS_SUCCESS,
            payload: {
                posts: normalizedData.entities['posts'] as HashTable<PostObject>,
                section: 'latest',
                allIds: normalizedData.result
            }
        });
    } catch (err) {
        dispatch(loadPostsError('latest'));
    }
};

const loadPostsRequest = (section: 'top' | 'latest'): LoadPostsRequest => {
    return {
        type: LOAD_POSTS_REQUEST,
        payload: {section}
    }
};

const loadPostsError = (section: 'top' | 'latest'): LoadPostsError => {
    return {
        type: LOAD_POSTS_ERROR,
        payload: {section}
    }
};

export const likePost = (postId: string, undo: boolean) => async (dispatch: (actions: PostActions) => any) => {
    console.log('likePost', postId, undo);
    const typeInteraction = undo ? "unlike" : "like";
    dispatch({type: INTERACT_POST_REQUEST, postId, typeInteraction});
    const likeInteraction = () => undo ? PostApi.unlikePost(postId) : PostApi.likePost(postId);
    try {
        const response = await likeInteraction();
        if (response.data)
            dispatch({type: INTERACT_POST_SUCCESS, post: response.data, typeInteraction});
        else
            dispatch({type: INTERACT_POST_ERROR, postId, typeInteraction});
    } catch (err) {
        console.log(err);
        dispatch({type: INTERACT_POST_ERROR, postId, typeInteraction});
    }
};

export const dislikePost = (postId: string, undo: boolean) => async (dispatch: (actions: PostActions) => any) => {
    console.log('dislikePost', postId, undo);
    const typeInteraction = undo ? "undislike" : "dislike";
    dispatch({type: INTERACT_POST_REQUEST, postId, typeInteraction});
    const dislikeInteraction = () => undo ? PostApi.undislikePost(postId) : PostApi.dislikePost(postId);
    try {
        const response = await dislikeInteraction();
        if (response.data)
            dispatch({type: INTERACT_POST_SUCCESS, post: response.data, typeInteraction});
        else
            dispatch({type: INTERACT_POST_ERROR, postId, typeInteraction});
    } catch (err) {
        console.log(err);
        dispatch({type: INTERACT_POST_ERROR, postId, typeInteraction});
    }
};