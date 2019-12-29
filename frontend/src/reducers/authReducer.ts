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
                userId: action.payload
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
        case TYPES.SUBMITTING_POST:
        case TYPES.POST_CREATED:
            return {
                ...state,
                newPostStatus: action.type
            };
        default:
            return state;
    }
};