import React, {useEffect} from "react";
import {fetchPosts} from "../../../actions/postActions";
import {connect} from "react-redux";
import Post, {PostResponse} from "./Post";

const NewsFeed: React.FC<{ posts: Array<any>, fetchPosts: () => any }> = ({posts, fetchPosts}) => {
    //const {state: {post}, dispatch} = useStateValue();
    //const [posts, setPosts] = useState<Array<PostResponse>>([]);
    useEffect(() => {
        console.log('fetching posts!!');
        const loadPosts = () => {
            fetchPosts();
        };
        loadPosts();
    }, []);
    return (
        <div className='news-feed'>
            {posts && posts.map((post: PostResponse) => <Post postResponse={post} key={post.id}/>)}
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    posts: state.post.posts
});

export default connect(mapStateToProps, {fetchPosts})(NewsFeed);