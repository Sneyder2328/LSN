import React, {useState} from "react";
import {TextEditor} from "./TextEditor";
import {POST_CREATED_SUCCESS} from "../../../actions/types";
import {connect} from "react-redux";
import {Post} from "../NewsFeed/Post";
import {createPost} from "../../../actions/postActions";

type Props = { createPostStatus: string; createPost: (post: Post) => any };

const CreatePost: React.FC<Props> = ({createPostStatus, createPost}) => {

    const [text, setText] = useState<string>('');

    const handleClick = () => {
        const newPost = {
            text,
            type: 'text',
            img: ''
        };
        createPost(newPost);
    };

    return (
        <div className='create-post'>
            <span className='title'>Create post</span>
            <div id='content'>
                <img id='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'
                     alt='profile picture'/>
                <TextEditor onChange={setText} cleanUpWhen={createPostStatus === POST_CREATED_SUCCESS}
                            placeholder="What's happening?"/>
            </div>
            <div id='publish'>
                <button id='post-btn' disabled={text.length === 0} onClick={handleClick}>Post</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state: any) => ({
    createPostStatus: state.post.createPostStatus,
});

export default connect(mapStateToProps, {createPost})(CreatePost)