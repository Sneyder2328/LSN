import {createAction, createReducer} from "@reduxjs/toolkit";
import {logInUser2} from "./authActions";

export interface AuthState {
    isAuthenticated: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isLoggingOut: boolean;
    userId?: string;
    // signUpError?: FormError;
    logInError?: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isSigningUp: false
}

export const userLoggedInRequest = createAction('USER_LOGGED_IN_REQUEST')
export const userLoggedInSuccess = createAction<string>('USER_LOGGED_IN_SUCCESS')
export const userLoggedInError = createAction<string>('USER_LOGGED_IN_ERROR')

// export type AuthActions = userLoggedInRequest.type | userLoggedInSuccess.type | userLoggedInError.type

export const authReducer = createReducer(
    initialState, {
        [userLoggedInSuccess.type]: (state, action) => {
            return {
                ...state,
                isLoggingIn: false,
                isLoggingOut: false,
                isSigningUp: false,
                isAuthenticated: true,
                userId: action.payload
            }
        },
        [userLoggedInError.type]: (state, action) => {
            return {
                ...state,
                isLoggingIn: false,
                isLoggingOut: false,
                isSigningUp: false,
                isAuthenticated: false,
                logInError: action.payload
            }
        }
    }
)