import React, {useEffect} from "react";
import {loadPosts} from "../../../actions/postActions";
import {connect} from "react-redux";
import Post, {PostResponse} from "./Post";
import {compareByDateAsc} from "../../../utils/utils";
import {AppState} from "../../../reducers";

const NewsFeed: React.FC<{ posts: Array<PostResponse>, fetchPosts: () => any }> = ({posts, fetchPosts}) => {
    useEffect(() => {
        console.log('fetching posts!!');
        const loadPosts = () => {
            fetchPosts();
        };
        loadPosts();
    }, []);
    return (
        <div className='news-feed'>
            {posts && posts.sort(compareByDateAsc).map((post: PostResponse) => <Post postResponse={post}
                                                                                     key={post.id}/>)}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    posts: state.post.posts
});

export default connect(mapStateToProps, {fetchPosts: loadPosts})(NewsFeed);