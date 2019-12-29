import {TYPES} from "./index";

const initialState = {
    newPostStatus: ''
};

export const postReducer = (state = initialState, action: any) => {
    switch (action.type) {
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