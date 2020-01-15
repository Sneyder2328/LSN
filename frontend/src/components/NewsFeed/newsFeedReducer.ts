import {
    CREATE_POST_ERROR,
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS, LOAD_POSTS_ERROR,
    LOAD_POSTS_REQUEST,
    LOAD_POSTS_SUCCESS
} from "../../actions/types";
import {Actions} from "../../reducers";

type NewsFeedList = {
    postIds: Array<string>
    isLoadingPosts: boolean
};

export interface NewsFeedState {
    isCreatingPost: boolean;
    top: NewsFeedList,
    latest: NewsFeedList
}

const initialState: NewsFeedState = {
    isCreatingPost: false,
    latest: {
        isLoadingPosts: false,
        postIds: []
    },
    top: {
        isLoadingPosts: false,
        postIds: []
    }
};

export const newsFeedReducer = (state: NewsFeedState = initialState, action: Actions): NewsFeedState => {
    switch (action.type) {
        case CREATE_POST_REQUEST:
            return {
                ...state,
                isCreatingPost: true
            };
        case CREATE_POST_SUCCESS:
            return {
                isCreatingPost: false,
                latest: {
                    ...state.latest,
                    postIds: [action.postCreated.id, ...state.latest.postIds]
                },
                top: {
                    ...state.latest,
                    postIds: [action.postCreated.id, ...state.latest.postIds]
                }
            };
        case CREATE_POST_ERROR:
            return {
                ...state,
                isCreatingPost: false
            };
        case LOAD_POSTS_REQUEST:
            return {
                ...state,
                [action.payload.section]: {
                    ...state[action.payload.section],
                    isLoadingPosts: true
                }
            };
        case LOAD_POSTS_SUCCESS:
            return {
                ...state,
                [action.payload.section]: {
                    postIds: action.payload.allIds,
                    isLoadingPosts: false
                }
            };
        case LOAD_POSTS_ERROR:
            return {
                ...state,
                [action.payload.section]: {
                    ...state.latest,
                    isLoadingPosts: false
                }
            };
        default:
            return state;
    }
};