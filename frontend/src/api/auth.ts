import {transport} from "./index";

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
    async logOut(){
        return await transport.delete('/sessions/')
    }
};