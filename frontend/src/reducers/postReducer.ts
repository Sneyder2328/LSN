import {TYPES} from "./index";

interface PostStatus {
    newPostStatus: string
}

const initialState = {
    newPostStatus: ''
} as PostStatus;


export const postReducer = (state: PostStatus = initialState, action: any) => {
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