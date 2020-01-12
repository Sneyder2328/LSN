import axios from "axios";
import {getTokens, isTokenExpired, updateAccessToken} from "../utils/tokensManager";
import {ACCESS_TOKEN, FOURTEEN_MINUTES_IN_MILLIS} from "../utils/constants";
import {AuthApi} from "../components/Auth/authApi";

export const transport = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true
});

transport.interceptors.request.use(async (config) => {
    if (config.url !== '/tokens' && isTokenExpired(getTokens().dateAccessTokenIssued, FOURTEEN_MINUTES_IN_MILLIS)) {
        const accessToken = await AuthApi.getNewAccessToken(getTokens().refreshToken);
        if (accessToken) updateAccessToken(accessToken);
        config.headers[ACCESS_TOKEN] = accessToken;
    }
    return config;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});