import {profilesSlice} from "./profileReducer";
import {ProfileApi} from "./profileApi";
import {normalize} from "normalizr";
import {profile} from "../../api/schema";
import {HashTable} from "../../utils/utils";
import {postActions, PostObject} from "../Post/postReducer";
import {CommentObject, commentsActions} from "../Comment/commentReducer";
import {UserObject, usersActions} from "../User/userReducer";
const {fetchProfileError, fetchProfileRequest, fetchProfileSuccess} = profilesSlice.actions
const {setPosts} = postActions
const {setComments} = commentsActions
const {setUser,setUsers} = usersActions


export const fetchProfile = (userIdentifier: string, includePosts: boolean): any => async (dispatch:any) => {
    console.log('fetchProfile', userIdentifier, includePosts);
    dispatch(fetchProfileRequest())
    try {
        const response = await ProfileApi.fetchProfile(userIdentifier, includePosts)
        console.log('response', response.data);
        const normalizedData = normalize(response.data, profile)
        console.log('normalizedData', normalizedData);

        const posts = normalizedData.entities['posts'] as HashTable<PostObject>
        const comments = normalizedData.entities['comments'] as HashTable<CommentObject>
        const profileHashTable = normalizedData.entities['profile'] as HashTable<any>
        const profileObj = profileHashTable[normalizedData.result]

        console.log('profileObj', profileObj);
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