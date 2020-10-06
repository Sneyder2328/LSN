import {searchActions, UserSearch} from "./searchReducer";
import {SearchApi} from "./searchApi";
import {normalize} from "normalizr";
import {user} from "../../api/schema";
import {HashTable} from "../../utils/utils";
import {AppThunk} from "../../store";
const {searchUserError,searchUserRequest,searchUserSuccess} = searchActions

export const searchUser = (query: string): AppThunk => async (dispatch) => {
    try {
        dispatch(searchUserRequest())
        const response = await SearchApi.searchUser(query);
        const usersNormalized = normalize(response.data, [user]);
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