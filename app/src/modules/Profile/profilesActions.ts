import {postActions, PostObject} from "../Post/postsReducer";
import {CommentObject, commentsActions} from "../Comment/commentsReducer";
import {profilesActions} from "./profilesReducer";
import {AppThunk} from "../../store";
import {ProfileApi} from "./profileApi";
import {normalize} from "normalizr";
import {profile} from "../api/schema";
import {HashTable} from "../../utils/utils";
import {UserObject, usersActions} from "../usersReducer";

const {setUsers, setUser} = usersActions
const {setPosts} = postActions
const {setComments} = commentsActions
const {fetchProfileError, fetchProfileRequest, fetchProfileSuccess} = profilesActions


export const fetchProfile = (userIdentifier: string, includePosts: boolean): AppThunk => async (dispatch) => {
    console.log('fetchProfile', userIdentifier, includePosts);
    dispatch(fetchProfileRequest())
    try {
        const response = await ProfileApi.fetchProfile(userIdentifier, includePosts)

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