import {HashTable} from "../../utils/utils";
import {UserActions, UserObject} from "./userReducer";
import {SET_USERS} from "../../actions/types";

export const setUsers = (users: HashTable<UserObject>): UserActions => {
    return {
        type: SET_USERS,
        users
    };
};