import {ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_TOKEN_ISSUED_AT} from "./constants";

export const getTokens = () => {
    return {
        accessToken: localStorage.getItem(ACCESS_TOKEN),
        refreshToken: localStorage.getItem(REFRESH_TOKEN),
        dateRefreshTokenIssued: parseInt(localStorage.getItem(REFRESH_TOKEN_ISSUED_AT) as string)
    };
};

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    localStorage.setItem(REFRESH_TOKEN_ISSUED_AT, new Date().getTime().toString());
};

export const removeTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN_ISSUED_AT);
};