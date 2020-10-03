import axios from "axios";
import {store} from "../store";
import {authSlice} from "../reducers/authReducer";
import {MyAppState} from "../reducers/rootReducer";

const {logOutError, logOutSuccess, refreshAccessTokenSuccess} = authSlice.actions
// const REACT_APP_BASE_URL = 'http://localhost:3030'
const REACT_APP_BASE_URL = "https://lasocialnetwork.herokuapp.com"

export const setAccessTokenHeaders = (accessToken: string) => {
    transport.defaults.headers.common['authorization'] = accessToken;
};

export const setRefreshTokenHeaders = (refreshToken: string) => {
    transport.defaults.headers.common['authorization-refresh-token'] = refreshToken;
};

export const removeAuthTokenHeaders = () => {
    delete transport.defaults.headers.common['authorization'];
    delete transport.defaults.headers.common['authorization-refresh-token'];
};

export const transport = axios.create({
    baseURL: REACT_APP_BASE_URL,
    withCredentials: true
});
//
// transport.interceptors.request.use(async (config) => {
//     if (config.url !== '/tokens' && isTokenExpired(getTokens().dateAccessTokenIssued, FOURTEEN_MINUTES_IN_MILLIS)) {
//         const accessToken = await AuthApi.getNewAccessToken(getTokens().refreshToken);
//         if (accessToken) updateAccessToken(accessToken);
//         config.headers[ACCESS_TOKEN] = accessToken;
//     }
//     return config;
// }, function (error) {
//     // Do something with response error
//     return Promise.reject(error);
// });

// Response interceptor for API calls
transport.interceptors.response.use((response) => response, async function (error) {
    const originalRequest = error.config;
    console.log('originalRequest=', originalRequest);
    if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== "/tokens") {
        console.log('in interceptors before refreshAccessToken v10.0');
        // @ts-ignore
        const accessTokenRefreshed = await refreshAccessToken(store.dispatch, store.getState);
        if (accessTokenRefreshed) {
            originalRequest._retry = true;
            console.log('interceptors returning originalRequest', accessTokenRefreshed);
            originalRequest.headers['authorization'] = accessTokenRefreshed;
            return transport(originalRequest);
        }
        console.log('interceptors rejecting');
        return Promise.reject(error);
    }
    return Promise.reject(error);
});


const refreshAccessToken = async (dispatch: Function, getState: () => MyAppState): Promise<string|undefined> => {
    try {
        const {refreshToken} = getState().auth;
        console.log('refreshAccessToken refreshToken=', refreshToken);
        if (refreshToken) {
            const accessToken = await getNewAccessToken(refreshToken)
            if (accessToken) {
                // transport.defaults.headers.common['authorization'] = accessToken; // HERE
                dispatch(refreshAccessTokenSuccess(accessToken))
                return Promise.resolve(accessToken)
            }
        } else { // if not refreshToken in state log out automatically
            dispatch(logOutSuccess());
        }
    } catch (err) { // if error
        console.log("error logging out", err);
        dispatch(logOutSuccess());
    }
    console.log('refreshAccessToken resolving...');
    return Promise.resolve(undefined)
};

async function getNewAccessToken(refreshToken: string): Promise<string | undefined> {
    console.log('getNewAccessToken', refreshToken);
    const response = await transport.get('/tokens', {headers: {['authorization-refresh-token']: refreshToken}});
    console.log('getNewAccessToken response=', response);
    // const response = await transport.get('/tokens', {headers: {[`${REFRESH_TOKEN}`]: refreshToken}});
    if (response?.data?.accessTokenIssued === true)
        return Promise.resolve(response.headers['authorization'] as string)
    if (response.status === 401)
        return Promise.reject('Refresh token not authorized')
    // throw new Error('Refresh token not authorized')
    console.log('getNewAccessToken resolving to undefined');
    return Promise.resolve(undefined)
}