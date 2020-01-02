import {ACCESS_TOKEN, ACCESS_TOKEN_ISSUED_AT, REFRESH_TOKEN, REFRESH_TOKEN_ISSUED_AT} from "./constants";

interface Tokens {
    accessToken: string;
    refreshToken: string;
    dateRefreshTokenIssued: number;
    dateAccessTokenIssued: number;
}

export const getTokens = (): Tokens => {
    return {
        accessToken: localStorage.getItem(ACCESS_TOKEN) as string,
        refreshToken: localStorage.getItem(REFRESH_TOKEN) as string,
        dateRefreshTokenIssued: parseInt(localStorage.getItem(REFRESH_TOKEN_ISSUED_AT) as string),
        dateAccessTokenIssued: parseInt(localStorage.getItem(ACCESS_TOKEN_ISSUED_AT) as string)
    };
};

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    const currentDate = new Date().getTime().toString();
    localStorage.setItem(ACCESS_TOKEN_ISSUED_AT, currentDate);
    localStorage.setItem(REFRESH_TOKEN_ISSUED_AT, currentDate);
};

export const removeTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN_ISSUED_AT);
    localStorage.removeItem(REFRESH_TOKEN_ISSUED_AT);
};

export const updateAccessToken = (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    const currentDate = new Date().getTime().toString();
    localStorage.setItem(ACCESS_TOKEN_ISSUED_AT, currentDate);
};

export const isTokenExpired = (dateIssued: number, duration: number) => {
    const currentDate = new Date().getTime();
    const expiryDate = dateIssued + duration;
    return expiryDate <= currentDate;
};