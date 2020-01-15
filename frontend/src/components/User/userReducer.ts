import {HashTable} from "../../utils/utils";
import {SET_USERS} from "../../actions/types";
import {Actions} from "../../reducers";
import {Profile} from "../Post/Post";

export type UsersState = {
    entities: HashTable<UserObject>;
    metas: HashTable<any>;
};

export interface UserObject extends Profile {
}

type SetUsers = {
    type: 'SET_USERS';
    users: HashTable<UserObject>
}

export type UserActions = SetUsers;

export const initialUsersState: UsersState = {
    entities: {},
    metas: {}
};

export const usersReducers = (state: UsersState = initialUsersState, action: Actions): UsersState => {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    ...action.users
                }
            };
        default:
            return state;
    }
};