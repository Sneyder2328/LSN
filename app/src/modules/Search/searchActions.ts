import {AppThunk} from "../../store";
import {normalize} from "normalizr";
import {user} from "../api/schema";
import {HashTable} from "../../utils/utils";
import {searchActions, UserSearch} from "./searchReducer";
import {SearchApi} from "./searchApi";

const {searchUserError, searchUserRequest, searchUserSuccess, updateSearchQuery} = searchActions

export const searchUser = (query: string): AppThunk => async (dispatch, getState) => {
    dispatch(updateSearchQuery({query}))
    if (query.length <= 2 || getState().search.isSearching) return
    try {
        dispatch(searchUserRequest())
        const response = await SearchApi.searchUser(query);
        const usersNormalized = normalize(response.data, [user]);
        console.log('search response=', usersNormalized);
        dispatch(searchUserSuccess({
            users: usersNormalized.entities.users as HashTable<UserSearch>,
            query,
            queryResults: usersNormalized.result
        }))
    } catch (err) {
        console.log(err);
        dispatch(searchUserError())
    }
};