import React, {useState} from "react";
import {useStateValue} from "../../../contexts/StateContext";
import {createPost} from "../../../actions/postActions";
import {TextEditor} from "./TextEditor";
import {POST_CREATED_SUCCESS} from "../../../actions/types";


export const CreatePost = () => {
    const [text, setText] = useState<string>('');

    const {dispatch} = useStateValue();

    const handleClick = async () => {
        const newPost = {
            text,
            type: 'text',
            img: ''
        };
        await createPost(dispatch, newPost);
    };

    // @ts-ignore
    const {state: {post}} = useStateValue();

    return (
        <div className='create-post'>
            <span className='title'>Create post</span>
            <div id='content'>
                <img id='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'
                     alt='profile picture'/>
                <TextEditor onChange={setText} cleanUpWhen={post.newPostStatus === POST_CREATED_SUCCESS}
                            placeholder="What's happening?"/>
            </div>
            <div id='publish'>
                <button id='post-btn' disabled={text.length === 0} onClick={handleClick}>Post</button>
            </div>
        </div>
    );
};