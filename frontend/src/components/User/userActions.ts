import {UserObject, usersActions} from "./userReducer";
import {UserApi} from "./userApi";
import {AppThunk} from "../../store";
const {setUsers} = usersActions

export const getUserBasicInfo = (userId: string): AppThunk => async (dispatch) => {
    const response = await UserApi.getUserProfile(userId);
    const user = response.data as UserObject;
    dispatch(setUsers({
        [user.userId]: user
    }));
};

export const getProfileDataWithPosts = (userId: string): AppThunk => async (dispatch) => {
    const response = await UserApi.getUserProfile(userId);
    const user = response.data as UserObject;
    dispatch(setUsers({
        [user.userId]: user
    }));
};