import axios from 'axios';
import {ACCESS_TOKEN, REFRESH_TOKEN} from "./constants";

export const setAuthToken = (accessToken: string, refreshToken: string) => {
    console.log("setAuthToken", accessToken, refreshToken);
    if (accessToken && refreshToken) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        axios.defaults.headers.common[ACCESS_TOKEN] = accessToken;
        axios.defaults.headers.common[REFRESH_TOKEN] = refreshToken;
    } else {
        delete axios.defaults.headers.common[ACCESS_TOKEN];
        delete axios.defaults.headers.common[REFRESH_TOKEN];
    }
};