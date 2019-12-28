export const initialState = {
    isLoggedIn: false
};

export const TYPES = {
    SIGN_UP: 'signUp',
    LOG_IN: 'logIn',
    SIGN_UP_ERROR: 'signUpError',
    LOG_IN_ERROR: 'logInError'
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.SIGN_UP:
        case TYPES.LOG_IN:
            return {
                ...state,
                isLoggedIn: true
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