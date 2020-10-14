import {transport} from "../../api";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../utils/constants";
import {setAccessTokenHeaders} from "../../utils/setAccessTokenHeaders";
import {ImageFile} from "../../utils/utils";
import {AxiosResponse} from "axios";
import {UserObject} from "../User/userReducer";

export interface ProfileRequest {
    userId: string;
    coverPhoto?: ImageFile;
    profilePhoto?: ImageFile;
    description: string;
    fullname: string;
    username: string;
}

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
    },
    async updateProfile(user: ProfileRequest): Promise<AxiosResponse<UserObject>> {
        const formData = new FormData();

        if (user.profilePhoto){
            // @ts-ignore
            formData.append('imageProfile', user.profilePhoto.file);
        }
        if (user.coverPhoto){
            // @ts-ignore
            formData.append('imageCover', user.coverPhoto.file);
        }
        formData.append('userId', user.userId);
        formData.append('fullname', user.fullname);
        formData.append('username', user.username);
        formData.append('description', user.description);

        return await transport.put(`/users/${user.userId}`, formData, {
            headers: {'content-type': 'multipart/form-data'}
        })
    }
};