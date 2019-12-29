import React, {useEffect, useState} from "react";
import {PostApi} from "../../../api/post";
import {Post, PostDetails} from "./Post";

export const NewsFeed = () => {
    const [posts, setPosts] = useState<Array<PostDetails>>([]);
    useEffect(() => {
        const getPosts = () => {
            PostApi.getPosts().then(response => {
                setPosts(response.data);
            }).catch(err => {
                console.log(err);
            });
        };
        getPosts();
    }, []);
    return (
        <div className='news-feed'>
            {posts.map(post => <Post post={post} key={post.id}/>)}
        </div>
    );
};