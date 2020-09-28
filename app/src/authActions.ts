import {setAccessTokenHeaders} from "../utils/setAccessTokenHeaders";
import {AuthApi} from "../api/authApi";
import {Constants} from "../utils/constants";
import {userLoggedInError, userLoggedInSuccess} from "./authReducer";
import JwtDecode from 'jwt-decode';
import {createAsyncThunk} from "@reduxjs/toolkit";

export type LoginCredentials = { username: string; password: string; };

export const logInUser = (credentials: LoginCredentials) => async (dispatch: (actions: any) => any) => {
    try {
        const response = await AuthApi.logIn(credentials);
        if (response.data.access === true) {
            const accessToken = response.headers['authorization'];
            console.log("accessToken", accessToken);
            // const refreshToken = response.headers[Constants.REFRESH_TOKEN];
            // setAccessTokenHeaders(accessToken);
            // setTokens(accessToken, refreshToken);

            // @ts-ignore
            dispatch(userLoggedInSuccess(JwtDecode(accessToken).id));
        }
    } catch (err) {
        console.log("error:", err);
        dispatch(userLoggedInError(err.response.data.message))
    }
};

export const logInUser2 = createAsyncThunk(
    'LogInUser',
    async (credentials: LoginCredentials, thunkAPI) => {
        const response = await AuthApi.logIn(credentials)
        return response.data
    }
)