import {PostApi} from "./postApi";
import {normalize} from "normalizr";
import {post} from "../../api/schema";
import {CommentObject, commentsActions} from "../Comment/commentReducer";
import {postActions, PostObject} from "./postReducer";
import {HashTable} from "../../utils/utils";
import {UserObject, usersActions} from "../User/userReducer";
import {AppThunk} from "../../store";
import {PostRequest} from "../../components/Post/Post";
const {setUsers} = usersActions
const {setComments} = commentsActions

const {
    loadPostsRequest, loadPostsSuccess, loadPostsError, interactPostError, interactPostRequest,
    interactPostSuccess, createPostError, createPostRequest, createPostSuccess
} = postActions

export const createPost = (postData: PostRequest): AppThunk => async (dispatch) => {
    console.log('createPost', postData);
    dispatch(createPostRequest({
        postId: postData.id,
        text: postData.text,
        imageFiles: postData.imageFiles,
        userId: postData.userId
    }));
    try {
        const response = postData.imageFiles.length !== 0 ? await PostApi.createPostWithImage(postData) : await PostApi.createPost(postData);
        const normalizedData = normalize(response.data, post);
        dispatch(createPostSuccess({postCreated: normalizedData.entities['posts']!![response.data.id] as PostObject}));
    } catch (err) {
        console.log(err);
        dispatch(createPostError({error: 'Error creating post'}));
    }
};

export const loadPosts = (): AppThunk => async (dispatch) => {
    try {
        dispatch(loadPostsRequest({section: 'latest'}));
        const response = await PostApi.getPosts();
        const normalizedData = normalize(response.data, [post]);
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setComments(normalizedData.entities['comments'] as HashTable<CommentObject>));
        dispatch(loadPostsSuccess({
            posts: normalizedData.entities['posts'] as HashTable<PostObject>,
            section: 'latest',
            allIds: normalizedData.result
        }))
    } catch (err) {
        console.log('loadPosts err', err);
        dispatch(loadPostsError({section: 'latest'}));
    }
};

export const likePost = (postId: string, undo: boolean): AppThunk => async (dispatch) => {
    console.log('likePost', postId, undo);
    const typeInteraction = undo ? "unlike" : "like";
    dispatch(interactPostRequest({postId, typeInteraction}))
    const likeInteraction = () => undo ? PostApi.unlikePost(postId) : PostApi.likePost(postId);
    try {
        const response = await likeInteraction();
        if (response.data)
            dispatch(interactPostSuccess({post: response.data, typeInteraction}))
        else
            dispatch(interactPostError({postId, typeInteraction}))
    } catch (err) {
        console.log(err);
        dispatch(interactPostError({postId, typeInteraction}))
    }
};

export const dislikePost = (postId: string, undo: boolean): AppThunk => async (dispatch) => {
    console.log('dislikePost', postId, undo);
    const typeInteraction = undo ? "undislike" : "dislike";
    dispatch(interactPostRequest({postId, typeInteraction}))
    const dislikeInteraction = () => undo ? PostApi.undislikePost(postId) : PostApi.dislikePost(postId);
    try {
        const response = await dislikeInteraction();
        if (response.data)
            dispatch(interactPostSuccess({post: response.data, typeInteraction}))
        else
            dispatch(interactPostError({postId, typeInteraction}))
    } catch (err) {
        console.log(err);
        dispatch(interactPostError({postId, typeInteraction}))
    }
};