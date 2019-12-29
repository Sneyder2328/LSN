import {Post} from "../components/Home/Post";
import {PostApi} from "../api/post";
import {TYPES} from "../reducers/authReducer";

export const createPost = async (dispatch: any, postData: Post) => {
    try {
        dispatch({type: TYPES.SUBMITTING_POST});
        const response = await PostApi.createPost(postData);
        console.log('new post response=', response);
        dispatch({type: TYPES.POST_CREATED});
    } catch (err) {
        console.log(err);
    }
};