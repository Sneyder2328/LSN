import {HashTable, HashTableArray} from "../../utils/utils";
import {Actions} from "../../reducers";
import {SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS} from "../../actions/types";

export type UserSearch = {
    userId: string;
    fullname: string;
    username: string;
    profilePhotoUrl: string;
};
export type SearchState = {
    users: HashTable<UserSearch>;
    queries: HashTableArray<string>;
    isSearching: boolean;
};

type SearchUserRequest = {
    type: 'SEARCH_USER_REQUEST'
};

type SearchUserSuccess = {
    type: 'SEARCH_USER_SUCCESS';
    payload: {
        users: HashTable<UserSearch>;
        query: string;
        queryResults: Array<string>;
    }
};

type SearchUserError = {
    type: 'SEARCH_USER_ERROR'
};

export type SearchActions =
    SearchUserRequest
    | SearchUserSuccess
    | SearchUserError;

const initialSearchState: SearchState = {
    users: {},
    queries: {},
    isSearching: false
};
export const searchReducer = (state: SearchState = initialSearchState, action: Actions): SearchState => {
    switch (action.type) {
        case SEARCH_USER_REQUEST:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_USER_SUCCESS:
            return {
                isSearching: false,
                queries: {
                    ...state.queries,
                    [action.payload.query]: action.payload.queryResults
                },
                users: {
                    ...state.users,
                    ...action.payload.users
                }
            };
        default:
            return state;
    }
};