import {transport} from "../../api";

export const UserApi = {
    async getUserProfile(userId: string, includePosts?: boolean) {
        return await transport.get(`/users/${userId}`, {params: {includePosts}});
    }
};