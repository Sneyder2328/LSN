import React, {FormEvent, useEffect, useRef, useState} from "react";
// @ts-ignore
import classnames from 'classnames';
import {useStateValue} from "../../contexts/StateContext";
import {createPost} from "../../actions/postActions";
import {TYPES} from "../../reducers/authReducer";

export const CreatePost = () => {
    const [text, setText] = useState('');
    // @ts-ignore
    const [{newPostStatus}, dispatch] = useStateValue();
    const editorRef: any = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (text.length === 1 && text.includes('\n')) // if div is like <div><br/></div> clean it up
            cleanUpTextEditor();
    }, [text]);

    const cleanUpTextEditor = () => {
        editorRef.current.innerText = '';
        setText('');
    };

    useEffect(() => {
        if (newPostStatus === TYPES.POST_CREATED) {
            cleanUpTextEditor();
        }
    }, [newPostStatus]);

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
                <div id='editor' ref={editorRef} contentEditable="true"
                     onInput={(e: FormEvent) => setText((e.target as HTMLDivElement).innerText)}
                     placeholder="What's happening?" className={
                    classnames(
                        {'medium': text.length > 35 || text.includes('\n')},
                        {'small': text.length > 100}
                    )}/>
            </div>
            <div id='publish'>
                <button id='post-btn' disabled={text.length === 0} onClick={handleClick}>Post
                </button>
            </div>
        </div>
    );
};