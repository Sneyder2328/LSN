import {transport} from "../api/lsn";
import {Constants} from "./constants";


export const setAccessTokenHeaders = (accessToken: string) => {
    transport.defaults.headers.common[Constants.ACCESS_TOKEN] = accessToken;
};

export const setRefreshTokenHeaders = (refreshToken: string) => {
    transport.defaults.headers.common[Constants.REFRESH_TOKEN] = refreshToken;
};

export const removeAuthTokenHeaders = () => {
    delete transport.defaults.headers.common[Constants.ACCESS_TOKEN];
    delete transport.defaults.headers.common[Constants.REFRESH_TOKEN];
};