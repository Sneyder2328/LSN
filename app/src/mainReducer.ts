import {combineReducers} from "@reduxjs/toolkit";
import {authReducer, AuthState} from "./authReducer";

export interface MyAppState {
    auth: AuthState;
}
export const mainReducer = combineReducers({
    auth: authReducer,
});