import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-community/async-storage";
import {persistReducer} from "redux-persist";
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

const persistConfig = {
    key: profilesSlice.name,
    storage: AsyncStorage
};

export const profilesReducer = persistReducer(persistConfig, profilesSlice.reducer)
export const profilesActions = profilesSlice.actions