import {HashTable} from "../../utils/utils";
import {GET_PROFILE_REQUEST} from "../../actions/types";

type Profile = {
    posts: Array<string>;
};
export type ProfilesState = HashTable<Profile>;

const initialProfilesState: ProfilesState = {};

type GetProfileRequest = {
    type: 'GET_PROFILE_REQUEST';
    username: string;
};

export type ProfileActions =
    GetProfileRequest

export const profilesReducer = (state: ProfilesState = initialProfilesState, action: ProfileActions): ProfilesState => {
    switch (action.type) {
        case GET_PROFILE_REQUEST:
            return {

            };
        default:
            return state;
    }
};