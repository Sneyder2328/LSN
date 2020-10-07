import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HashTable} from "../../utils/utils";

type Profile = {
    username: string;
    postsIds: Array<string>;
};
export type ProfilesState = HashTable<Profile>;

const initialProfilesState: ProfilesState = {};

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState: initialProfilesState,
    reducers: {
        fetchProfileRequest: (state) => {

        },
        fetchProfileSuccess: (state, action: PayloadAction<{ userId: string; postIds: Array<string>; username: string }>) => {
            state[action.payload.userId] = {
                postsIds: action.payload.postIds,
                username: action.payload.username
            }
        },
        fetchProfileError: (state) => {

        }
    }
})

export const profilesReducer = profilesSlice.reducer