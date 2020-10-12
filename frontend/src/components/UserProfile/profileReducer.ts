import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HashTable} from "../../utils/utils";
import {authActions} from "../Auth/authReducer";

const {logOutSuccess} = authActions

type Profile = {
    username: string;
    postsIds: Array<string>;
};
export type ProfilesState = HashTable<Profile>;

const initialState: ProfilesState = {};

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
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
    },
    extraReducers: builder => {
        builder.addCase(logOutSuccess, _ => initialState)
    }
})

export const profilesReducer = profilesSlice.reducer