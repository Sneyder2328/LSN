import JwtDecode from 'jwt-decode';
import {authActions} from "./authReducer";
import {AppThunk} from "../../store";
import {usersActions} from "../usersReducer";
import {AuthApi} from "./authApi";
import {MyAppState} from "../rootReducer";
import {setRefreshTokenHeaders} from "../api";

const {
    logOutRequest,
    logOutError,
    logOutSuccess,
    logInError,
    logInRequest,
    signInSuccess,
    signUpError,
    signUpRequest,
    updateProfileError,
    updateProfileRequest,
    updateProfileSuccess
} = authActions
const {setUser} = usersActions

export type SignUpCredentials = { username: string; fullname: string; password: string; email: string; };

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

export const signUpUser = (userData: SignUpCredentials): AppThunk => async (dispatch) => {
    dispatch(signUpRequest())
    try {
        const response = await AuthApi.signUp(userData);
        processSignInResponse({dispatch, response})
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
        processSignInResponse({dispatch, response})
    } catch (err) {
        console.log("logInError:", err);
        const error = err?.response?.data?.message || 'Network connection error'
        dispatch(logInError(error))
    }
};

export const updateProfile = (userId: string, fullname: string, username: string, description: string, profilePhotoUrl: string,
                              coverPhotoUrl: string): AppThunk => async (dispatch, getState) => {
    dispatch(updateProfileRequest())
    try {
        const response = await AuthApi.updateProfile({
            userId, fullname, username, description, profilePhotoUrl, coverPhotoUrl
        })
        console.log('updateProfile response', response);
        dispatch(setUser(response.data))
        dispatch(updateProfileSuccess())
    } catch (err) {
        console.log('updateProfile err', err);
        dispatch(updateProfileError(err.toString()))
    }
}

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