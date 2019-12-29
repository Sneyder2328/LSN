export const initialState = {
    isLoggedIn: false
};

export const TYPES = {
    SIGN_UP_ERROR: 'signUpError',
    LOG_IN_ERROR: 'logInError',
    SET_CURRENT_USER: 'setCurrentUser',
    SUBMITTING_POST: 'submittingPost',
    POST_CREATED: 'postCreated'
};

export const authReducer = (state = initialState, action) => {
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