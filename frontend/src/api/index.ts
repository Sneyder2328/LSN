import axios from "axios";
import {getTokens, isTokenExpired, updateAccessToken} from "../utils/tokensManager";
import {FOURTEEN_MINUTES_IN_MILLIS} from "../utils/constants";
import {AuthApi} from "./auth";

export const transport = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true
});

transport.interceptors.request.use(async (config) => {
    // Do something with response data
    console.log('config here', config);
    if (config.url !== '/tokens' &&
        isTokenExpired(getTokens().dateAccessTokenIssued, FOURTEEN_MINUTES_IN_MILLIS)) {
        console.log('token has expired');
        const accessToken = await AuthApi.getNewAccessToken(getTokens().refreshToken);
        if (accessToken) updateAccessToken(accessToken);
        console.log('new token is', accessToken);
    } else {
        console.log('token is ok');
    }
    return config;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});