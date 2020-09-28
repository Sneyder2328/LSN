import {SearchActions, UserSearch} from "./searchReducer";
import {SEARCH_USER_ERROR, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS} from "../../actions/types";
import {SearchApi} from "./searchApi";
import {normalize} from "normalizr";
import {user} from "../../api/schema";
import {HashTable} from "../../utils/utils";

export const searchUser = (query: string) => async (dispatch: (actions: SearchActions) => any) => {
    try {
        dispatch({type: SEARCH_USER_REQUEST});
        const response = await SearchApi.searchUser(query);
        const usersNormalized = normalize(response.data, [user]);
        dispatch({
            type: SEARCH_USER_SUCCESS,
            payload: {
                users: usersNormalized.entities.users as HashTable<UserSearch>,
                query,
                queryResults: usersNormalized.result
            }
        })
    } catch (err) {
        console.log(err);
        dispatch({
            type: SEARCH_USER_ERROR
        })
    }
};