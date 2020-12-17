import {UserObject, usersActions} from "./userReducer";
import {FriendRequestActionType, UserApi} from "./userApi";
import {AppThunk} from "../../store";
import {normalize} from "normalizr";
import {profile, user} from "../../api/schema";
import {HashTable} from "../../utils/utils";
import {CommentObject, commentsActions} from "../Comment/commentReducer";
import {postActions, PostObject} from "../Posts/postReducer";

const {
    setUser,
    setUsers,
    fetchProfileSuccess,
    fetchProfileRequest,
    fetchProfileError,
    sendFriendRequestError,
    sendFriendRequestRequest,
    sendFriendRequestSuccess,
    respondToFriendRequestError,
    respondToFriendRequestRequest,
    respondToFriendRequestSuccess,
    removeFriendshipSuccess,
    fetchFriendsSuccess,
    fetchPhotosSuccess
} = usersActions
const {setComments} = commentsActions
const {setPosts} = postActions

export const fetchProfile = (userIdentifier: string, includePosts: boolean): AppThunk => async (dispatch) => {
    console.log('fetchProfile', userIdentifier, includePosts)
    dispatch(fetchProfileRequest())
    try {
        const response = await UserApi.fetchProfile(userIdentifier, includePosts)
        const normalizedData = normalize(response.data, profile)

        const posts = normalizedData.entities['posts'] as HashTable<PostObject>
        const comments = normalizedData.entities['comments'] as HashTable<CommentObject>
        const profileHashTable = normalizedData.entities['profile'] as HashTable<any>
        const profileObj = profileHashTable[normalizedData.result]
        profileObj.postIds = [...profileObj.posts]
        delete profileObj.posts
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setUser({user: profileObj, meta: {relationship: profileObj.relationship}}))
        dispatch(setComments(comments))
        dispatch(setPosts(posts))
        dispatch(fetchProfileSuccess({
            userId: profileObj.userId,
            postIds: profileObj.postIds
        }))
    } catch (err) {
        console.log('fetchProfile err', err);
        dispatch(fetchProfileError())
    }
}

export const getUserBasicInfo = (userId: string): AppThunk => async (dispatch) => {
    try {
        const response = await UserApi.fetchProfile(userId, false);
        const user = response.data as UserObject;
        dispatch(setUsers({
            [user.userId]: user
        }))
    } catch (err) {
        console.log('getUserBasicInfo err', err);
    }
}

export const sendFriendRequest = (receiverId: string): AppThunk => async (dispatch) => {
    dispatch(sendFriendRequestRequest({receiverId}))
    try {
        const response = await UserApi.sendFriendRequest(receiverId)
        if (response.data)
            dispatch(sendFriendRequestSuccess({receiverId}))
        else
            dispatch(sendFriendRequestError({receiverId}))
    } catch (err) {
        console.log('sendFriendRequest err', err);
        dispatch(sendFriendRequestError({receiverId}))
    }
}

export const respondToFriendRequest = (senderId: string, action: FriendRequestActionType): AppThunk => async (dispatch) => {
    dispatch(respondToFriendRequestRequest({senderId}))
    try {
        const response = await UserApi.respondToFriendRequest(senderId, action)
        if (response.data)
            dispatch(respondToFriendRequestSuccess({senderId, action}))
        else
            dispatch(respondToFriendRequestError({senderId}))
    } catch (err) {
        console.log('sendFriendRequest err', err);
        dispatch(respondToFriendRequestError({senderId}))
    }
}

export const removeFriendship = (userId: string): AppThunk => async (dispatch) => {
    try {
        const response = await UserApi.removeFriendship(userId)
        if (response.data)
            dispatch(removeFriendshipSuccess({userId}))
    } catch (err) {
        console.log('removeFriendship err', err);
    }
}

export const fetchFriends = (userId: string): AppThunk => async (dispatch) => {
    try {
        const response = await UserApi.fetchFriends(userId)
        if (response.data) {
            const data = normalize(response.data, [user])
            dispatch(setUsers(data.entities['users'] as HashTable<UserObject>));
            dispatch(fetchFriendsSuccess({userId, friends: data.result}))
        }

    } catch (err) {
        console.log('fetchFriends err', err);
    }
}

export const fetchPhotos = (userId: string): AppThunk => async (dispatch) => {
    try {
        const response = await UserApi.fetchPhotos(userId)
        if (response.data) {
            dispatch(fetchPhotosSuccess({userId, photos: response.data}))
        }
    } catch (err) {
        console.log('fetchPhotos err', err);
    }
}

export const fetchUsersSuggestions = (): AppThunk => async (dispatch, getState) => {
    try {
        const response = await UserApi.fetchUsersSuggestions(getState().auth.userId!)
        if (response.data) {
            dispatch(usersActions.fetchUserSuggestionsSuccess({
                suggestions: response.data.map(({userId, relatedness}) => ({
                    userId,
                    relatedness
                }))
            }))
            const data = normalize(response.data.map(
                ({userId, fullname, username, profilePhotoUrl, coverPhotoUrl, description}) => ({
                    userId, fullname, username, profilePhotoUrl, coverPhotoUrl, description
                })), [user])
            dispatch(setUsers(data.entities.users as HashTable<UserObject>))
        }
    } catch (err) {
        console.log('fetchUsersSuggestions err', err);
    }
}


export const removeUserSuggestion = (userSuggestedId: string): AppThunk => async (dispatch) => {
    try {
        const response = await UserApi.removeUserSuggestion(userSuggestedId)
        if (response.data) {
            dispatch(usersActions.removeUserSuggestedSuccess({userSuggestedId}))
        }
    } catch (err) {
        console.log('removeUserSuggestion err', err);
    }
}