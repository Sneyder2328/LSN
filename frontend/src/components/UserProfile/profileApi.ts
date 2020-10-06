import {AxiosResponse} from "axios";
import {UserObject} from "../User/userReducer";
import {PostObject} from "../Post/postReducer";
import {transport} from "../../api";

export interface ProfileResponse extends UserObject {
    posts?: Array<PostObject>;
}

export const ProfileApi = {
    /**
     *
     * @param userIdentifier can be the userId or username of the user whose profile is to be fetched
     * @param includePosts whether to include the posts from the user or not in the response
     */
    async fetchProfile(userIdentifier: string, includePosts: boolean): Promise<AxiosResponse<ProfileResponse>> {
        return await transport.get(`/users/${userIdentifier}`, {params: {includePosts}})
    },
}