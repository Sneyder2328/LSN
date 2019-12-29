import {ACCESS_TOKEN, REFRESH_TOKEN} from "./constants";
import {transport} from "../api";

export const setAccessTokenHeaders = (accessToken: string) => {
    console.log('setAccessTokenHeaders', accessToken);
    transport.defaults.headers.common[ACCESS_TOKEN] = accessToken;
};

export const setRefreshTokenHeaders = (refreshToken: string) => {
    transport.defaults.headers.common[REFRESH_TOKEN] = refreshToken;
};

export const removeAuthTokenHeaders = () => {
    delete transport.defaults.headers.common[ACCESS_TOKEN];
    delete transport.defaults.headers.common[REFRESH_TOKEN];
};