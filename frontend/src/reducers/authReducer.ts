import {TYPES} from "./index";

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
        case TYPES.SET_CURRENT_USER:
            return {
                ...state,
                isLoggedIn: true,
                isLoggingOut: false,
                userId: action.payload
            };
        case TYPES.LOGGING_OUT:
            return {
                ...state,
                isLoggingOut: true
            };
        case TYPES.LOGGED_OUT:
            return {
                ...state,
                isLoggedIn: false
            };
        case TYPES.SIGN_UP_ERROR:
            return {
                ...state,
                signUpError: action.payload
            };
        case TYPES.LOG_IN_ERROR:
            return {
                ...state,
                logInError: action.payload
            };
        default:
            return state;
    }
};