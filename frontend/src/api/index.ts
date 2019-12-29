import axios from "axios";

export const transport = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true
});