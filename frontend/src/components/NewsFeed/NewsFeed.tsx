import React, {useEffect} from "react";
import {loadPosts} from "../Post/postActions";
import {connect} from "react-redux";
import Post from "../Post/Post";
import {AppState} from "../../reducers";
import './styles.scss'

const NewsFeed: React.FC<{ postsIds: Array<string>, fetchPosts: () => any }> = ({postsIds, fetchPosts}) => {
    useEffect(() => {
        console.log('fetching posts!!');
        const loadPosts = () => {
            fetchPosts();
        };
        loadPosts();
    }, [fetchPosts]);

    return (
        <div className='news-feed'>
            {postsIds && postsIds.map((postId: string) => <Post postId={postId} key={postId}/>)}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    postsIds: state.newsFeed.latest.postIds//.sort(compareByDateAsc)
});

export default connect(mapStateToProps, {fetchPosts: loadPosts})(NewsFeed);