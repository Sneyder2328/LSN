import {transport} from "../../api";
import {AxiosResponse} from "axios";
import {UserObject} from "./userReducer";
import {PostObject} from "../Posts/postReducer";

export interface ProfileResponse extends UserObject {
    posts?: Array<PostObject>;
}
export type FriendRequestActionType = 'confirm'|'deny'
export const UserApi = {
    // async getUserProfile(userId: string, includePosts?: boolean) {
    //     return await transport.get(`/users/${userId}`, {params: {includePosts}});
    // },
    /**
     *
     * @param userIdentifier can be the userId or username of the user whose profile is to be fetched
     * @param includePosts whether to include the posts from the user or not in the response
     */
    async fetchProfile(userIdentifier: string, includePosts: boolean): Promise<AxiosResponse<ProfileResponse>> {
        return await transport.get(`/users/${userIdentifier}`, {params: {includePosts}})
    },

    async sendFriendRequest(receiverUserId: string): Promise<AxiosResponse<boolean>> {
        return await transport.post(`/users/${receiverUserId}/friends`)
    },

    async respondToFriendRequest(senderId: string, action: FriendRequestActionType): Promise<AxiosResponse> {
        return await transport.put(`/users/${senderId}/friends`, null, {params: {action}})
    },

    // async getFriendRequests(): Promise<AxiosResponse<boolean>> {
    //     return await transport.post(`/users/${receiverUserId}/friends`)
    // },
};
