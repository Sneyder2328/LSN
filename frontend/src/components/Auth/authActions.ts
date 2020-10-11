import {AuthApi} from "./authApi";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../utils/constants";
import {removeAuthTokenHeaders, setAccessTokenHeaders, setRefreshTokenHeaders} from "../../utils/setAccessTokenHeaders";
import * as jwt_decode from 'jwt-decode';
import {getTokens, removeTokens, setTokens} from "../../utils/tokensManager";
import {authActions} from "./authReducer";
import {AppThunk} from "../../store";
import {AppState} from "../../reducers";
import JwtDecode from "jwt-decode";
import {usersActions} from "../User/userReducer";

const {
    updateProfileSuccess,
    updateProfileRequest,
    refreshAccessTokenSuccess,
    logOutRequest,
    signUpRequest,
    logInRequest,
    signUpError,
    logOutSuccess,
    logInError,
    logOutError,
    signInSuccess
} = authActions
const {setUser} = usersActions


const processSignInResponse = ({dispatch, response}: { dispatch: any, response: any }) => {
    if (response.data.access === true && response.data.profile) {
        const accessToken = response.headers['authorization'];
        console.log("accessToken", accessToken);
        const refreshToken = response.headers['authorization-refresh-token'];
        const userId: string = JwtDecode<{ id: string }>(accessToken).id
        dispatch(setUser(response.data.profile))
        dispatch(signInSuccess({userId, accessToken, refreshToken}));
    }
}

export type SignUpCredentials = { username: string; fullname: string; password: string; email: string; };

export const signUpUser = (userData: SignUpCredentials): AppThunk => async (dispatch) => {
    dispatch(signUpRequest())
    try {
        const response = await AuthApi.signUp(userData);
        processSignInResponse({dispatch, response})
        // if (response.data.access === true) {
        //     const accessToken = response.headers[ACCESS_TOKEN];
        //     const refreshToken = response.headers[REFRESH_TOKEN];
        //     setAccessTokenHeaders(accessToken);
        //     setTokens(accessToken, refreshToken);
        //     // @ts-ignore
        //     dispatch(setCurrentUser(jwt_decode(accessToken).id));
        // }
    } catch (err) {
        console.log("error:", err);
        const error = err?.response?.data?.error || 'Network connection error'
        const message = err?.response?.data?.message || 'Network connection error'
        dispatch(signUpError({fieldName: error, message}))
    }
};

export type LoginCredentials = { username: string; password: string; };

export const logInUser = (credentials: LoginCredentials): AppThunk => async (dispatch) => {
    dispatch(logInRequest());
    try {
        const response = await AuthApi.logIn(credentials);
        processSignInResponse({dispatch, response})
        // if (response.data.access === true) {
        //     const accessToken = response.headers[ACCESS_TOKEN];
        //     const refreshToken = response.headers[REFRESH_TOKEN];
        //     setAccessTokenHeaders(accessToken);
        //     setTokens(accessToken, refreshToken);
        //     // @ts-ignore
        //     dispatch(setCurrentUser(jwt_decode(accessToken).id));
        // }
    } catch (err) {
        console.log("error:", err);
        const error = err?.response?.data?.error || 'Network connection error'
        const message = err?.response?.data?.message || 'Network connection error'
        dispatch(logInError({fieldName: error, message}))
    }
};


export const logOutUser = (): AppThunk => async (dispatch: Function, getState: () => AppState) => {
    dispatch(logOutRequest());
    try {
        // const {refreshToken} = getTokens();
        // setRefreshTokenHeaders(refreshToken);
        // await AuthApi.logOut();
        // removeAuthTokenHeaders();
        // removeTokens();
        // dispatch(loggedOut());
        const {refreshToken} = getState().auth;
        setRefreshTokenHeaders(refreshToken!!);
        await AuthApi.logOut();
        dispatch(logOutSuccess());
    } catch (err) {
        console.log("error logging out", err);
        dispatch(logOutError());
    }
};