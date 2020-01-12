import React, {useState} from "react";
import {TextEditor} from "./TextEditor";
import {connect} from "react-redux";
import {Post} from "../Post/Post";
import {createPost} from "../Post/postActions";
import './styles.scss'

type Props = {
    createPost: (post: Post) => any;
};

const CreatePost: React.FC<Props> = ({createPost}) => {

    const [text, setText] = useState<string>('');

    const handleClick = () => {
        const newPost = {
            text,
            type: 'text',
            img: ''
        };
        createPost(newPost);
        setText('clean')
    };

    return (
        <div className='create-post'>
            <span className='title'>Create post</span>
            <div className='content'>
                <img className='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'
                     alt='profile picture'/>
                <TextEditor className='editor' onChange={setText} cleanUpWhen={text === 'clean'}
                            placeholder="What's happening?"/>
            </div>
            <div className='publish'>
                <button className='post-btn' disabled={text.length === 0} onClick={handleClick}>Post</button>
            </div>
        </div>
    );
};

export default connect(null, {createPost})(CreatePost)