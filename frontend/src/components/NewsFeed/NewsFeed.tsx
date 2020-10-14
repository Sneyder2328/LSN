import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Post from "../Post/Post";
import './styles.scss'
import {AppState} from "../../modules/rootReducer";
import {loadPosts} from "../../modules/Posts/postActions";

export const NewsFeed = () => {
    const dispatch = useDispatch()
    const postsIds = useSelector((state: AppState) => state.newsFeed.latest.postIds)

    useEffect(() => {
        console.log('fetching posts!!');
        dispatch(loadPosts())
    }, [loadPosts, dispatch]);

    return (
        <div className='news-feed'>
            {postsIds?.map((postId: string) => <Post postId={postId} key={postId}/>)}
        </div>
    );
};