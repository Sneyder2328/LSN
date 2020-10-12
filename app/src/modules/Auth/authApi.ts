import {transport} from "../api";
import {UserObject} from "../usersReducer";
import {AxiosResponse} from "axios";
import {ImageFile} from "../../utils/utils";

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
    async logIn({username, password}: { username: string; password: string; }) {
        return await transport.post('/sessions/', {username, password});
    },
    async logOut() {
        return await transport.delete('/sessions/')
    },
    async updateProfile(user: ProfileRequest): Promise<AxiosResponse<UserObject>> {
        const formData = new FormData();

        if (user.profilePhoto){
            // @ts-ignore
            formData.append('imageProfile', user.profilePhoto);
        }
        if (user.coverPhoto){
            // @ts-ignore
            formData.append('imageCover', user.coverPhoto);
        }
        formData.append('userId', user.userId);
        formData.append('fullname', user.fullname);
        formData.append('username', user.username);
        formData.append('description', user.description);

        return await transport.put(`/users/${user.userId}`, formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
    }
};