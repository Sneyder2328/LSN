import { PostApi, LIMIT_POSTS_IN_USER_PROFILE } from "./postApi";
import { normalize } from "normalizr";
import { post } from "../../api/schema";
import { CommentObject, commentsActions } from "../Comment/commentReducer";
import { postActions, PostObject } from "./postReducer";
import { HashTable } from "../../utils/utils";
import { UserObject, usersActions } from "../User/userReducer";
import { AppThunk } from "../../store";
import { PostRequest } from "../../components/Post/Post";

const { setUsers } = usersActions
const { setComments } = commentsActions

const {
    loadPostsRequest, loadPostsSuccess, loadPostsError, interactPostError, interactPostRequest,
    interactPostSuccess, createPostError, createPostRequest, createPostSuccess, loadPostsByUserSuccess, loadPostsByUserRequest, loadPostsByUserError
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
        dispatch(createPostSuccess({ postCreated: normalizedData.entities['posts']!![response.data.id] as PostObject }));
    } catch (err) {
        console.log(err);
        dispatch(createPostError({ error: 'Error creating post' }));
    }
};

export const loadPosts = (): AppThunk => async (dispatch, getStore) => {
    const currentSection = getStore().newsFeed.currentSection;
    try {
        dispatch(loadPostsRequest({ section: currentSection }));
        const postIds = getStore().newsFeed[currentSection].postIds;
        const lastPostId = postIds.length > 0 ? postIds[postIds.length - 1] : undefined
        const offset = lastPostId ? getStore().posts.entities[lastPostId].createdAt : undefined
        const response = await PostApi.getPosts(getStore().newsFeed.currentSection, offset);
        const normalizedData = normalize(response.data, [post]);
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setComments(normalizedData.entities['comments'] as HashTable<CommentObject>));
        dispatch(loadPostsSuccess({
            posts: normalizedData.entities['posts'] as HashTable<PostObject>,
            section: currentSection,
            allIds: normalizedData.result
        }))
    } catch (err) {
        console.log('loadPosts err', err);
        dispatch(loadPostsError({ section: currentSection }));
    }
};

export const loadPost = (postId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(postActions.loadPostRequest());
        const response = await PostApi.getPost(postId);
        processPost(dispatch, response)
    } catch (err) {
        console.log('loadPost err', err);
        dispatch(postActions.loadPostError());
    }
};

export const loadPostsByUser = (userId: string): AppThunk => async (dispatch, getStore) => {
    dispatch(loadPostsByUserRequest({userId}))
    try {
        const offset = getStore().posts.users[userId].offset
        const response = await PostApi.getPostsByUser(userId, offset);
        const normalizedData = normalize(response.data.posts, [post]);
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setComments(normalizedData.entities['comments'] as HashTable<CommentObject>));
        console.log('byuser posts', normalizedData);
        dispatch(loadPostsByUserSuccess({
            userId: response.data.userId,
            posts: normalizedData.entities['posts'] as HashTable<PostObject>,
            postsIds: normalizedData.result
        }))
    } catch (err) {
        console.log('loadPostsByUser err', err);
        dispatch(loadPostsByUserError({userId}))
    }
};

export const loadPostByPhoto = (photoId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(postActions.loadPostRequest());
        const response = await PostApi.getPostByPhotoId(photoId);
        processPost(dispatch, response)
    } catch (err) {
        console.log('loadPost err', err);
        dispatch(postActions.loadPostError());
    }
};

const processPost = (dispatch: any, response: any) => {
    const normalizedData = normalize(response.data, post);
    console.log('loadPost normalized=', normalizedData);
    dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
    dispatch(setComments(normalizedData.entities['comments'] as HashTable<CommentObject>));
    dispatch(postActions.loadPostSuccess({
        post: normalizedData.entities['posts'] as HashTable<PostObject>
    }))
}

export const likePost = (postId: string, undo: boolean): AppThunk => async (dispatch) => {
    console.log('likePost', postId, undo);
    const typeInteraction = undo ? "unlike" : "like";
    dispatch(interactPostRequest({ postId, typeInteraction }))
    const likeInteraction = () => undo ? PostApi.unlikePost(postId) : PostApi.likePost(postId);
    try {
        const response = await likeInteraction();
        if (response.data)
            dispatch(interactPostSuccess({ post: response.data, typeInteraction }))
        else
            dispatch(interactPostError({ postId, typeInteraction }))
    } catch (err) {
        console.log(err);
        dispatch(interactPostError({ postId, typeInteraction }))
    }
};

export const dislikePost = (postId: string, undo: boolean): AppThunk => async (dispatch) => {
    console.log('dislikePost', postId, undo);
    const typeInteraction = undo ? "undislike" : "dislike";
    dispatch(interactPostRequest({ postId, typeInteraction }))
    const dislikeInteraction = () => undo ? PostApi.undislikePost(postId) : PostApi.dislikePost(postId);
    try {
        const response = await dislikeInteraction();
        if (response.data)
            dispatch(interactPostSuccess({ post: response.data, typeInteraction }))
        else
            dispatch(interactPostError({ postId, typeInteraction }))
    } catch (err) {
        console.log(err);
        dispatch(interactPostError({ postId, typeInteraction }))
    }
};