import {AuthApi} from "../api/authApi";

import JwtDecode from 'jwt-decode';
import {MyAppState} from "../reducers/rootReducer";
import {setRefreshTokenHeaders} from "../api";
import {AppThunk} from "../store";
import {authSlice} from "../reducers/authReducer";


const {logOutRequest, logOutError, logOutSuccess, logInError, logInRequest, signInSuccess, signUpError, signUpRequest} = authSlice.actions

export type SignUpCredentials = { username: string; fullname: string; password: string; email: string; };

export const signUpUser = (userData: SignUpCredentials): AppThunk => async (dispatch) => {
    dispatch(signUpRequest())
    try {
        const response = await AuthApi.signUp(userData);
        if (response.data.access === true) {
            const accessToken = response.headers['authorization'];
            console.log("accessToken", accessToken);
            const refreshToken = response.headers['authorization-refresh-token'];
            const userId: string = JwtDecode<{ id: string }>(accessToken).id
            dispatch(signInSuccess({userId, accessToken, refreshToken}));
        }
    } catch (err) {
        console.log("signUpError:", err);
        const error = err?.response?.data?.message || 'Network connection error'
        dispatch(signUpError(error))
    }
};

export type LoginCredentials = { username: string; password: string; };

export const logInUser = (credentials: LoginCredentials): AppThunk => async (dispatch) => {
    dispatch(logInRequest());
    try {
        const response = await AuthApi.logIn(credentials);
        if (response.data.access === true) {
            const accessToken = response.headers['authorization'];
            console.log("accessToken", accessToken);
            const refreshToken = response.headers['authorization-refresh-token'];
            const userId: string = JwtDecode<{ id: string }>(accessToken).id
            dispatch(signInSuccess({userId, accessToken, refreshToken}));
        }
    } catch (err) {
        console.log("logInError:", err);
        const error = err?.response?.data?.message || 'Network connection error'
        dispatch(logInError(error))
    }
};

export const logOutUser = () => async (dispatch: Function, getState: () => MyAppState) => {
    dispatch(logOutRequest());
    try {
        const {refreshToken} = getState().auth;
        setRefreshTokenHeaders(refreshToken!!);
        await AuthApi.logOut();
        dispatch(logOutSuccess());
    } catch (err) {
        console.log("error logging out", err);
        dispatch(logOutError());
    }
};

// export const refreshAccessToken = async (dispatch: Function, getState: () => MyAppState) => {
//     try {
//         const {refreshToken} = getState().auth;
//         if (refreshToken) {
//             const accessToken = await AuthApi.getNewAccessToken(refreshToken)
//             if (accessToken) {
//                 dispatch(refreshAccessTokenSuccess(accessToken))
//             }
//         } else {
//             dispatch(logOutSuccess());
//         }
//     } catch (err) {
//         console.log("error logging out", err);
//         dispatch(logOutError());
//     }
//     return Promise.resolve();
// };