import {TYPES} from "../reducers/authReducer";
import {AuthApi} from "../api/auth";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../utils/constants";
import {setAuthToken} from "../utils/setAuthToken";
// @ts-ignore
import * as jwt_decode from 'jwt-decode';

export const signUpUser = async (userData: { username: string; fullname: string; password: string; email: string; }) => {
    try {
        const response = await AuthApi.signUp(userData);
        if (response.data.access === true) {
            console.log("Signed up successfully!");
            const accessToken = response.headers[ACCESS_TOKEN];
            const refreshToken = response.headers[REFRESH_TOKEN];
            setAuthToken(accessToken, refreshToken);
            return {
                type: TYPES.SIGN_UP,
                payload: jwt_decode(accessToken)
            };
        }
    } catch (err) {
        console.log("error:", err);
        return {
            type: TYPES.SIGN_UP_ERROR,
            payload: {fieldName: err.response.data.error, message: err.response.data.message}
        }
    }
};

export const logInUser = async (credentials: { username: string; password: string; }) => {
    try {
        const response = await AuthApi.logIn(credentials);
        if (response.data.access === true) {
            console.log("Logged in successfully!");
            const accessToken = response.headers[ACCESS_TOKEN];
            const refreshToken = response.headers[REFRESH_TOKEN];
            setAuthToken(accessToken, refreshToken);
            return {
                type: TYPES.LOG_IN,
                payload: jwt_decode(accessToken)
            };
        }
    } catch (err) {
        console.log("error:", err);
        return {
            type: TYPES.LOG_IN_ERROR,
            payload: {fieldName: err.response.data.error, message: err.response.data.message}
        }
    }
};