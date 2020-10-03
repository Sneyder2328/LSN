import {PostObject, postsSlice} from "../reducers/postsReducer"
import {usersSlice} from "../reducers/usersReducer"
import {commentsSlice} from "../reducers/commentsReducer"
const {setUsers} = usersSlice.actions
const {setComments} = commentsSlice.actions
import {normalize} from "normalizr";
import {PostApi} from "../api/postApi";
import {HashTable} from "../utils/utils";
import {post} from "../api/schema";
import {AppThunk} from "../store";
import {UserObject} from "../reducers/usersReducer";
import {CommentObject} from "../reducers/commentsReducer";

const {
    loadPostsRequest, loadPostsSuccess, loadPostsError, interactPostError, interactPostRequest, interactPostSuccess
} = postsSlice.actions

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

export const dislikePost = (postId: string, undo: boolean):AppThunk => async (dispatch) => {
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