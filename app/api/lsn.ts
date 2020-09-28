import axios from "axios";
// const REACT_APP_BASE_URL = 'http://localhost:3030'
const REACT_APP_BASE_URL="https://lasocialnetwork.herokuapp.com"

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