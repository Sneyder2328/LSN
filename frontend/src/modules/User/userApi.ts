import {transport} from "../../api";
import {AxiosResponse} from "axios";
import {UserObject, UserSuggestion} from "./userReducer";
import {PostObject} from "../Posts/postReducer";

export interface ProfileResponse extends UserObject {
    posts?: Array<PostObject>;
}

export type FriendRequestActionType = 'confirm' | 'deny'

interface SuggestionsResponse extends UserSuggestion, UserObject {
}

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

    async removeFriendship(otherUserId: string): Promise<AxiosResponse<boolean>> {
        return await transport.delete(`/users/${otherUserId}/friends`)
    },

    async respondToFriendRequest(senderId: string, action: FriendRequestActionType): Promise<AxiosResponse> {
        return await transport.put(`/users/${senderId}/friends`, null, {params: {action}})
    },

    async fetchFriends(userId: string): Promise<AxiosResponse<Array<UserObject>>> {
        return transport.get(`/users/${userId}/friends`)
    },

    async fetchUsersSuggestions(userId: string): Promise<AxiosResponse<Array<SuggestionsResponse>>> {
        return transport.get(`/suggestions/${userId}`)
    },

    async removeUserSuggestion(userSuggestedId: string): Promise<AxiosResponse<boolean>> {
        return transport.delete(`/suggestions/${userSuggestedId}`)
    }
    // async getFriendRequests(): Promise<AxiosResponse<boolean>> {
    //     return await transport.post(`/users/${receiverUserId}/friends`)
    // },
};
