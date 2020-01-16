import {
    CREATE_POST_SUCCESS,
    LOAD_POSTS_SUCCESS,
    CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_ERROR,
    CREATE_COMMENT_SUCCESS,
    LOAD_COMMENTS_REQUEST,
    LOAD_COMMENTS_ERROR,
    LOAD_COMMENTS_SUCCESS,
    INTERACT_POST_REQUEST,
    INTERACT_POST_ERROR,
    INTERACT_POST_SUCCESS
} from "../../actions/types";
import {Post} from "./Post";
import {HashTable} from "../../utils/utils";
import {Actions} from "../../reducers";

export interface PostObject extends Post {
    id: string;
    userId: string;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    createdAt: any;
    comments: Array<string>;
    //authorProfile: Profile; delete this one while normalizing with normalizr
    likeStatus: 'like' | 'dislike' | undefined;
}

export interface PostMetadata {
    isLoadingPreviousComments?: boolean;
    isCreatingComment?: boolean;
    likeStatus: 'like' | 'dislike' | undefined;
}

export type PostState = {
    entities: HashTable<PostObject>;
    metas: HashTable<PostMetadata>;
};

type CreatePostRequest = {
    type: 'CREATE_POST_REQUEST'
};
type CreatePostSuccess = {
    type: 'CREATE_POST_SUCCESS';
    postCreated: PostObject
};
type CreatePostError = {
    type: 'CREATE_POST_ERROR';
    error: string
};
export type LoadPostsRequest = {
    type: 'LOAD_POSTS_REQUEST'
    payload: {
        section: 'top' | 'latest';
    };
};
export type LoadPostsSuccess = {
    type: 'LOAD_POSTS_SUCCESS';
    payload: {
        posts: HashTable<PostObject>;
        section: 'top' | 'latest';
        allIds: Array<string>;
    };
};
export type LoadPostsError = {
    type: 'LOAD_POSTS_ERROR';
    payload: {
        section: 'top' | 'latest';
    };
};

type InteractPostRequest = {
    type: 'INTERACT_POST_REQUEST';
    postId: string;
    typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
}

type InteractPostSuccess = {
    type: 'INTERACT_POST_SUCCESS';
    post: {
        id: string;
        likesCount: number;
        dislikesCount: number;
    };
    typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
}

type InteractPostError = {
    type: 'INTERACT_POST_ERROR';
    postId: string;
    typeInteraction: 'like' | 'unlike' | 'dislike' | 'undislike';
}

export type PostActions =
    CreatePostRequest
    | CreatePostSuccess
    | CreatePostError
    | LoadPostsRequest
    | LoadPostsSuccess
    | LoadPostsError
    | InteractPostRequest
    | InteractPostSuccess
    | InteractPostError

export const initialPostsState: PostState = {
    entities: {},
    metas: {}
};

export const postsReducer = (state: PostState = initialPostsState, action: Actions): PostState => {
    switch (action.type) {
        case INTERACT_POST_REQUEST:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.postId]: {
                        ...state.metas[action.postId],
                        likeStatus: (action.typeInteraction === "like" || action.typeInteraction === "dislike") ? action.typeInteraction : undefined
                    }
                }
            };
        case INTERACT_POST_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.post.id]: {
                        ...state.entities[action.post.id],
                        likeStatus: (action.typeInteraction === "like" || action.typeInteraction === "dislike") ? action.typeInteraction : undefined,
                        likesCount: action.post.likesCount,
                        dislikesCount: action.post.dislikesCount,
                    }
                }
            };
        case INTERACT_POST_ERROR:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.postId]: {
                        ...state.metas[action.postId],
                        likeStatus: undefined
                    }
                }
            };
        case CREATE_POST_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.postCreated.id]: action.postCreated
                }
            };
        case LOAD_POSTS_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    ...action.payload.posts
                }
            };
        case CREATE_COMMENT_REQUEST:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.postId]: {
                        ...state.metas[action.postId],
                        isCreatingComment: true
                    }
                }
            };
        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.comment.postId]: {
                        ...state.entities[action.comment.postId],
                        comments: [...state.entities[action.comment.postId].comments, action.comment.id],
                        commentsCount: state.entities[action.comment.postId].commentsCount + 1
                    }
                },
                metas: {
                    ...state.metas,
                    [action.comment.postId]: {
                        ...state.metas[action.comment.postId],
                        isCreatingComment: false
                    }
                }
            };
        case CREATE_COMMENT_ERROR:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.postId]: {
                        ...state.metas[action.postId],
                        isCreatingComment: false
                    }
                } // need to update errors as well with some error message
            };
        case LOAD_COMMENTS_REQUEST:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.postId]: {
                        ...state.metas[action.postId],
                        isLoadingPreviousComments: true
                    }
                }
            };
        case LOAD_COMMENTS_ERROR:
            return {
                ...state,
                metas: {
                    ...state.metas,
                    [action.postId]: {
                        ...state.metas[action.postId],
                        isLoadingPreviousComments: false
                    }
                }// need to update errors as well with some error message
            };
        case LOAD_COMMENTS_SUCCESS:
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.postId]: {
                        ...state.entities[action.payload.postId],
                        comments: [...action.payload.newCommentsIds, ...state.entities[action.payload.postId].comments]
                    }
                },
                metas: {
                    ...state.metas,
                    [action.payload.postId]: {
                        ...state.metas[action.payload.postId],
                        isLoadingPreviousComments: false
                    }
                }
            };
        default:
            return state;
    }
};