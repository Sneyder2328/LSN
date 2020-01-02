import {AuthApi} from "../api/auth";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../utils/constants";
import {removeAuthTokenHeaders, setAccessTokenHeaders, setRefreshTokenHeaders} from "../utils/setAccessTokenHeaders";
// @ts-ignore
import * as jwt_decode from 'jwt-decode';
import {getTokens, removeTokens, setTokens} from "../utils/tokensManager";
import {LOG_IN_ERROR, LOGGED_OUT, LOGGING_OUT, SET_CURRENT_USER, SIGN_UP_ERROR} from "./types";
import {AuthActions, loginAction} from "../reducers/authReducer";

export type SignUpCredentials = { username: string; fullname: string; password: string; email: string; };

export const signUpUser = (userData: SignUpCredentials) => async (dispatch: (actions: AuthActions) => any) => {
    try {
        const response = await AuthApi.signUp(userData);
        if (response.data.access === true) {
            const accessToken = response.headers[ACCESS_TOKEN];
            const refreshToken = response.headers[REFRESH_TOKEN];
            setAccessTokenHeaders(accessToken);
            setTokens(accessToken, refreshToken);
            dispatch(setCurrentUser(jwt_decode(accessToken)));
        }
    } catch (err) {
        console.log("error:", err);
        dispatch({
            type: SIGN_UP_ERROR,
            payload: {fieldName: err.response.data.error, message: err.response.data.message}
        });
    }
};

export type LoginCredentials = { username: string; password: string; };

export const logInUser = (credentials: LoginCredentials) => async (dispatch: (actions: AuthActions) => any) => {
    try {
        const response = await AuthApi.logIn(credentials);
        if (response.data.access === true) {
            const accessToken = response.headers[ACCESS_TOKEN];
            const refreshToken = response.headers[REFRESH_TOKEN];
            setAccessTokenHeaders(accessToken);
            setTokens(accessToken, refreshToken);
            dispatch(setCurrentUser(jwt_decode(accessToken)));
        }
    } catch (err) {
        console.log("error:", err);
        dispatch({
            type: LOG_IN_ERROR,
            payload: {fieldName: err.response.data.error, message: err.response.data.message}
        });
    }
};

// Set logged in user
export const setCurrentUser = (decoded: string): loginAction => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// Log user out
export const logOutUser = () => async (dispatch: Function) => {
    try {
        dispatch({type: LOGGING_OUT});
        const {refreshToken} = getTokens();
        setRefreshTokenHeaders(refreshToken);
        await AuthApi.logOut();
        removeAuthTokenHeaders();
        removeTokens();
        dispatch({type: LOGGED_OUT});
    } catch (err) {
        console.log("error logging out", err);
    }
    dispatch(setCurrentUser(''));
};