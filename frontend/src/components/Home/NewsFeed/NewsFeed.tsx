import React, {useEffect} from "react";
import {Post, PostResponse} from "./Post";
import {useStateValue} from "../../../contexts/StateContext";
import {fetchPosts} from "../../../actions/postActions";

export const NewsFeed = () => {
    const {state: {post}, dispatch} = useStateValue();
    //const [posts, setPosts] = useState<Array<PostResponse>>([]);
    useEffect(() => {
        console.log('fetching posts ', post);
        const loadPosts = () => {
            fetchPosts(dispatch).then(res => {
            }).catch(err => {
            });
        };
        loadPosts();
    }, []);
    return (
        <div className='news-feed'>
            {post.posts && post.posts.map((post: PostResponse) => <Post postResponse={post} key={post.id}/>)}
        </div>
    );
};