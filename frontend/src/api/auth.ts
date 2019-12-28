import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const transport = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export const AuthApi = {
    async signUp(userData: { username: string; fullname: string; password: string; email: string; }) {
        console.log("baseURL=", BASE_URL);
        const response = await transport.post('/users/', {
            username: userData.username,
            fullname: userData.fullname,
            password: userData.password,
            typeLogin: 'email',
            email: userData.email,
            description: '',
            profilePhotoUrl: '',
            coverPhotoUrl: ''
        });
        console.log("response=", response);
        return response;
    },
    async logIn(credentials: { username: string; password: string; }) {
        return await transport.post('/sessions/', {
            username: credentials.username,
            password: credentials.password
        });
    }
};