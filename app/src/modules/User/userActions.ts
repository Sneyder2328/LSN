import {postActions, PostObject} from "../Post/postsReducer";
import {CommentObject, commentsActions} from "../Comment/commentsReducer";
import {AppThunk} from "../../store";
import {normalize} from "normalizr";
import {profile} from "../api/schema";
import {HashTable} from "../../utils/utils";
import {UserObject, usersActions} from "./usersReducer";
import {FriendRequestActionType, UserApi} from "./userApi";
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
    respondToFriendRequestSuccess
} = usersActions
const {setPosts} = postActions
const {setComments} = commentsActions


export const fetchProfile = (userIdentifier: string, includePosts: boolean): AppThunk => async (dispatch) => {
    console.log('fetchProfile', userIdentifier, includePosts);
    dispatch(fetchProfileRequest())
    try {
        const response = await UserApi.fetchProfile(userIdentifier, includePosts)

        const normalizedData = normalize(response.data, profile)
        console.log('normalizedData', normalizedData);
        const posts = normalizedData.entities['posts'] as HashTable<PostObject>
        const comments = normalizedData.entities['comments'] as HashTable<CommentObject>
        const profileHashTable = normalizedData.entities['profile'] as HashTable<any>
        const profileObj = profileHashTable[normalizedData.result]
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setComments(comments))
        dispatch(setPosts(posts))
        dispatch(fetchProfileSuccess({
            userId: profileObj.userId,
            postIds: profileObj.posts,
            username: profileObj.username
        }))
        delete profileObj.posts
        dispatch(setUser(profileObj))
    } catch (err) {
        console.log('fetchProfile err', err);
        dispatch(fetchProfileError())
    }
}


export const getUserBasicInfo = (userId: string): AppThunk => async (dispatch) => {
    const response = await UserApi.fetchProfile(userId, false);
    const user = response.data as UserObject;
    dispatch(setUsers({
        [user.userId]: user
    }))
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