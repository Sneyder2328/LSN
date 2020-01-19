import React, {ChangeEventHandler, useState} from "react";
import {TextEditor} from "../commons/TextEditor";
import {connect} from "react-redux";
import {Post} from "../Post/Post";
import {createPost} from "../Post/postActions";
import './styles.scss'

type Props = {
    createPost: (post: Post) => any;
};

const CreatePost: React.FC<Props> = ({createPost}) => {
    const [text, setText] = useState<string>('');
    const [cleanTextEditor, setCleanTextEditor] = useState<boolean>(false);
    const [imageFiles, setImageFiles] = useState<Array<File>>();

    const handleClick = () => {
        const newPost: Post = {
            text,
            type: 'text',
            imageFiles
        };
        createPost(newPost);
        setImageFiles(undefined);
        setCleanTextEditor(true);
    };

    const shouldCleanUpTextEditor = () => {
        if (cleanTextEditor) {
            setCleanTextEditor(false);
            return true;
        }
        return false;
    };

    const onChangeHandler = (event: any) => {
        console.log('files', event.target.files);
        if (imageFiles)
            setImageFiles([...imageFiles, ...event.target.files]);
        else
            setImageFiles([...event.target.files]);
    };

    return (
        <div className='create-post'>
            <span className='title'>Create post</span>
            <div className='content'>
                <img className='avatar' src='https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'
                     alt='profile avatar'/>
                <TextEditor className='editor' onChange={setText} cleanUpWhen={shouldCleanUpTextEditor}
                            placeholder="What's happening?"/>
            </div>

            <div className='publish'>
                <div className='image'>
                    <input type='file' name='file' id='file' multiple onChange={onChangeHandler} accept="image/*"/>
                    <label htmlFor='file'><i className="far fa-images"/></label>
                </div>
                <div className='post'>
                    <button className='post-btn' disabled={text.length === 0 && imageFiles === undefined}
                            onClick={handleClick}>Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default connect(null, {createPost})(CreatePost)