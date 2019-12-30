import {TYPES} from "../reducers";
import {AuthApi} from "../api/auth";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../utils/constants";
import {removeAuthTokenHeaders, setAccessTokenHeaders, setRefreshTokenHeaders} from "../utils/setAccessTokenHeaders";
// @ts-ignore
import * as jwt_decode from 'jwt-decode';
import {getTokens, removeTokens, setTokens} from "../utils/tokensManager";

export type SignUpCredentials = { username: string; fullname: string; password: string; email: string; };
export const signUpUser = async (userData: SignUpCredentials) => {
    try {
        const response = await AuthApi.signUp(userData);
        if (response.data.access === true) {
            const accessToken = response.headers[ACCESS_TOKEN];
            const refreshToken = response.headers[REFRESH_TOKEN];
            setAccessTokenHeaders(accessToken);
            setTokens(accessToken, refreshToken);
            return setCurrentUser(jwt_decode(accessToken));
        }
    } catch (err) {
        console.log("error:", err);
        return {
            type: TYPES.SIGN_UP_ERROR,
            payload: {fieldName: err.response.data.error, message: err.response.data.message}
        }
    }
};

export type LoginCredentials = { username: string; password: string; };

export const logInUser = async (credentials: LoginCredentials) => {
    try {
        const response = await AuthApi.logIn(credentials);
        if (response.data.access === true) {
            const accessToken = response.headers[ACCESS_TOKEN];
            const refreshToken = response.headers[REFRESH_TOKEN];
            setAccessTokenHeaders(accessToken);
            setTokens(accessToken, refreshToken);
            return setCurrentUser(jwt_decode(accessToken));
        }
    } catch (err) {
        console.log("error:", err);
        return {
            type: TYPES.LOG_IN_ERROR,
            payload: {fieldName: err.response.data.error, message: err.response.data.message}
        }
    }
};

// Set logged in user
export const setCurrentUser = (decoded: any) => {
    return {
        type: TYPES.SET_CURRENT_USER,
        payload: decoded
    };
};

// Log user out
export const logOut = async (dispatch: Function) => {
    try {
        dispatch({type: TYPES.LOGGING_OUT});
        const {refreshToken} = getTokens();
        setRefreshTokenHeaders(refreshToken);
        await AuthApi.logOut();
        removeAuthTokenHeaders();
        removeTokens();
        dispatch({type: TYPES.LOGGED_OUT});
    } catch (err) {
        console.log("error logging out", err);
    }
    return setCurrentUser({});
};