import React, {FormEvent, useEffect, useRef, useState} from "react";
// @ts-ignore
import classnames from 'classnames';
import {useStateValue} from "../../../contexts/StateContext";
import {createPost} from "../../../actions/postActions";
import {TYPES} from "../../../reducers";

export const CreatePost = () => {
    const [text, setText] = useState('');
    // @ts-ignore
    const [{post}, dispatch] = useStateValue();
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
        if (post.newPostStatus === TYPES.POST_CREATED) {
            cleanUpTextEditor();
        }
    }, [post.newPostStatus]);

    const handleClick = async () => {
        const newPost = {
            text,
            type: 'text',
            img: ''
        };
        await createPost(dispatch, newPost);
    };

    /**
     * Paste text with plain/text format in the text editor, important to avoid
     * @param e
     */
    const pastePlainText = (e: FormEvent) => {
        e.preventDefault();
        // get text representation of clipboard
        let text = ((e as any).originalEvent || e).clipboardData.getData('text/plain');
        // replace line breaks with <br> for proper formatting in html
        text = text.replace(/\n/g, '<br>');
        // insert text manually
        document.execCommand("insertHTML", false, text);
    };

    return (
        <div className='create-post'>
            <span className='title'>Create post</span>
            <div id='content'>
                <img id='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'
                     alt='profile picture'/>
                <div id='editor' ref={editorRef} contentEditable="true"
                     onInput={(e: FormEvent) => setText((e.target as HTMLDivElement).innerText)}
                     onPaste={pastePlainText}
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