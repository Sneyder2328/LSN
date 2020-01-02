import {LOG_IN_ERROR, LOGGED_OUT, LOGGING_OUT, SET_CURRENT_USER, SIGN_UP_ERROR} from "../actions/types";

export type FormError = { fieldName: string; message: string };

interface AuthState {
    isLoggedIn: boolean;
    isLoggingOut: boolean;
    userId: string;
    signUpError?: FormError;
    logInError?: FormError;
    newPostStatus: string | number;
}

const initialState = {
    isLoggedIn: false,
    isLoggingOut: false,
    userId: '',
    newPostStatus: ''
} as AuthState;

export type loginAction = {
    type: 'SET_CURRENT_USER';
    payload: string;
};

type logoutAction = {
    type: 'LOGGING_OUT';
};

export type loggedOutAction = {
    type: 'LOGGED_OUT';
};

type loginErrorAction = {
    type: 'LOG_IN_ERROR';
    payload: FormError;
};

type signupErrorAction = {
    type: 'SIGN_UP_ERROR';
    payload: FormError;
};

export type AuthActions =
    loginAction | logoutAction | loggedOutAction | loginErrorAction | signupErrorAction

export const authReducer = (state: AuthState = initialState, action: AuthActions): AuthState => {
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
                ...initialState
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