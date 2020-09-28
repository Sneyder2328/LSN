import {HashTable} from "../../utils/utils";
import {UserActions, UserObject} from "./userReducer";
import {SET_USERS} from "../../actions/types";
import {Actions} from "../../reducers";
import {UserApi} from "./userApi";

export const setUsers = (users: HashTable<UserObject>): UserActions => {
    return {
        type: SET_USERS,
        users
    };
};

export const getUserBasicInfo = (userId: string) => async (dispatch: (actions: Actions) => any) => {
    const response = await UserApi.getUserProfile(userId);
    const user = response.data as UserObject;
    dispatch(setUsers({
        [user.userId]: user
    }));
};

export const getProfileDataWithPosts = (userId: string) => async (dispatch: (actions: Actions) => any) => {
    const response = await UserApi.getUserProfile(userId);
    const user = response.data as UserObject;
    dispatch(setUsers({
        [user.userId]: user
    }));
};