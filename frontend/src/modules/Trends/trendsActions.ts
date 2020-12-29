import { normalize } from "normalizr";
import { post } from "../../api/schema";
import { AppThunk } from "../../store";
import { HashTable } from "../../utils/utils";
import { CommentObject, commentsActions } from "../Comment/commentReducer";
import { postActions, PostObject } from "../Posts/postReducer";
import { UserObject, usersActions } from "../User/userReducer";
import { TrendsApi } from "./trendsApi";
import { trendsActions } from "./trendsReducer";
const { setUsers } = usersActions
const { setComments } = commentsActions
const { setPosts } = postActions

export const loadTrends = (): AppThunk => async (dispatch) => {
    try {
        const response = await TrendsApi.fetchTrends()
        if (response.data) {
            dispatch(trendsActions.loadTrendsSuccess({ trends: response.data }))
        }
    } catch (err) {

    }
}

export const loadPostsByTrend = (trend: string): AppThunk => async (dispatch) => {
    try {
        const response = await TrendsApi.getPostsByTrend(trend)
        const normalizedData = normalize(response.data, [post]);
        dispatch(setUsers(normalizedData.entities['users'] as HashTable<UserObject>));
        dispatch(setComments(normalizedData.entities['comments'] as HashTable<CommentObject>));
        dispatch(setPosts(normalizedData.entities['posts'] as HashTable<PostObject>));
        dispatch(trendsActions.loadPostsByTrendSuccess({name: trend, postsIds: normalizedData.result}))
    } catch (err) {

    }
}