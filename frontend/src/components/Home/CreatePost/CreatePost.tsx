import React, {FormEvent, useState} from "react";
// @ts-ignore
import classnames from 'classnames';
import {useStateValue} from "../../../contexts/StateContext";
import {createPost} from "../../../actions/postActions";
import {TextEditor} from "./TextEditor";


export const CreatePost = () => {
    const [text, setText] = useState<string>('');
    // @ts-ignore
    const {dispatch} = useStateValue();

    const handleClick = async () => {
        const newPost = {
            text,
            type: 'text',
            img: ''
        };
        await createPost(dispatch, newPost);
    };

    return (
        <div className='create-post'>
            <span className='title'>Create post</span>
            <div id='content'>
                <img id='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'
                     alt='profile picture'/>
                <TextEditor onChange={setText}/>
            </div>
            <div id='publish'>
                <button id='post-btn' disabled={text.length === 0} onClick={handleClick}>Post</button>
            </div>
        </div>
    );
};