import {Post} from "../components/Home/NewsFeed/Post";
import {PostApi} from "../api/post";
import {CREATING_POST, FETCHING_POSTS, POST_CREATED_ERROR, POST_CREATED_SUCCESS, POSTS_FETCHED} from "./types";
import {Actions} from "../reducers/postReducer";

export const createPost = async (dispatch: (actions: Actions) => any, postData: Post) => {
    try {
        dispatch({type: CREATING_POST});
        const response = await PostApi.createPost(postData);
        console.log('new post response=', response);
        dispatch({type: POST_CREATED_SUCCESS});
    } catch (err) {
        console.log(err);
        dispatch({type: POST_CREATED_ERROR});
    }
};

export const fetchPosts = async (dispatch: (actions: Actions) => any,) => {
    try {
        dispatch({type: FETCHING_POSTS});
        const response = await PostApi.getPosts();
        dispatch({
            type: POSTS_FETCHED,
            posts: response.data
        });
    } catch (err) {

    }
};
