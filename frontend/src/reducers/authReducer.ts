import {LOG_IN_ERROR, LOGGED_OUT, LOGGING_OUT, SET_CURRENT_USER, SIGN_UP_ERROR} from "../actions/types";

interface AuthState {
    isLoggedIn: boolean;
    userId: string;
    signUpError: string;
    logInError: string;
    newPostStatus: string | number;
}

const initialState = {
    isLoggedIn: false,
    isLoggingOut: false,
    userId: '',
    signUpError: '',
    logInError: '',
    newPostStatus: ''
} as AuthState;

export const authReducer = (state: AuthState = initialState, action: any) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isLoggedIn: true,
                isLoggingOut: false,
                userId: action.payload
            };
        case LOGGING_OUT:
            return {
                ...state,
                isLoggingOut: true
            };
        case LOGGED_OUT:
            return {
                ...state,
                isLoggedIn: false
            };
        case SIGN_UP_ERROR:
            return {
                ...state,
                signUpError: action.payload
            };
        case LOG_IN_ERROR:
            return {
                ...state,
                logInError: action.payload
            };
        default:
            return state;
    }
};