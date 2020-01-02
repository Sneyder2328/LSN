import {transport} from "./index";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../utils/constants";
import {setAccessTokenHeaders} from "../utils/setAccessTokenHeaders";

export const AuthApi = {
    async signUp(userData: { username: string; fullname: string; password: string; email: string; }) {
        return await transport.post('/users/', {
            username: userData.username,
            fullname: userData.fullname,
            password: userData.password,
            typeLogin: 'email',
            email: userData.email,
            description: '',
            profilePhotoUrl: '',
            coverPhotoUrl: ''
        });
    },
    async logIn(credentials: { username: string; password: string; }) {
        return await transport.post('/sessions/', {
            username: credentials.username,
            password: credentials.password
        });
    },
    async getNewAccessToken(refreshToken: string): Promise<string | undefined> {
        const response = await transport.get('/tokens', {headers: {[REFRESH_TOKEN]: refreshToken}});
        if (response.data.accessTokenIssued === true) {
            const accessToken = response.headers[ACCESS_TOKEN] as string;
            setAccessTokenHeaders(accessToken);
            return accessToken
        }
    },
    async logOut() {
        return await transport.delete('/sessions/')
    }
};