import {LOG_IN_ERROR, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, SET_CURRENT_USER, SIGN_UP_ERROR} from "../../actions/types";

export type FormError = { fieldName: string; message: string };

export interface AuthState {
    isAuthenticated: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isLoggingOut: boolean;
    userId: string;
    signUpError?: FormError;
    logInError?: FormError;
}

const initialState = {
    isAuthenticated: false,
    isLoggingOut: false,
    isSigningUp: false,
    isLoggingIn: false,
    userId: ''
} as AuthState;

export type loginAction = {
    type: 'SET_CURRENT_USER';
    payload: string;
};

type logOutRequest = {
    type: 'LOG_OUT_REQUEST';
};

export type logOutSuccess = {
    type: 'LOG_OUT_SUCCESS';
};

type logInError = {
    type: 'LOG_IN_ERROR';
    payload: FormError;
};

type signUpError = {
    type: 'SIGN_UP_ERROR';
    payload: FormError;
};

export type AuthActions =
    loginAction | logOutRequest | logOutSuccess | logInError | signUpError

export const authReducer = (state: AuthState = initialState, action: AuthActions): AuthState => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: true,
                isLoggingOut: false,
                isLoggingIn: false,
                isSigningUp: false,
                userId: action.payload
            };
        case LOG_OUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true
            };
        case LOG_OUT_SUCCESS:
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