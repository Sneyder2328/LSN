import React, {useState} from "react";
import {TextEditor} from "../commons/TextEditor";
import {connect} from "react-redux";
import {PostRequest} from "../Post/Post";
import {createPost} from "../Post/postActions";
import './styles.scss'

// @ts-ignore
import Img from 'react-fix-image-orientation'
import {MAX_FILE_SIZE, MAX_IMAGES_PER_POST} from "../../utils/constants";
import {genUUID, ImageFile, readImgFileContent} from "../../utils/utils";
import {AppState} from "../../reducers";

type Props = {
    createPost: (post: PostRequest) => any;
    userId: string;
};

const CreatePost: React.FC<Props> = ({userId, createPost}) => {
    const [text, setText] = useState<string>('');
    const [cleanTextEditor, setCleanTextEditor] = useState<boolean>(false);
    const [imageFiles, setImageFiles] = useState<Array<ImageFile>>([]);

    console.log('userId hereee', userId);

    const handleClick = () => {
        const newPost: PostRequest = {
            id: genUUID(),
            userId,
            text,
            imageFiles: imageFiles.map(it => it.file)
        };
        createPost(newPost);
        setImageFiles([]);
        setCleanTextEditor(true);
    };

    const shouldCleanUpTextEditor = () => {
        if (cleanTextEditor) {
            setCleanTextEditor(false);
            return true;
        }
        return false;
    };

    const onInputImgsHandler = async (event: any) => {
        let uploadedImages: Array<ImageFile> = imageFiles ? [...imageFiles] : [];

        for (let n = 0; n < event.target.files.length; n++) {
            // @ts-ignore
            const file = event.target.files[n];
            console.log('file size', file.size);
            if (!file.type.match('image/')) {
                alert("Only jpg/jpeg and png files are allowed!");
            } else if (file.size > MAX_FILE_SIZE) {
                alert(`'${file.name}' is too large, please pick a smaller file`);
            } else if (!uploadedImages.some(img => img.name === file.name)) { // image is not already uploaded
                uploadedImages.push({file, name: file.name});
            }
        }
        if (uploadedImages.length > MAX_IMAGES_PER_POST) {
            alert('Only up to 12 images can be uploaded at a time');
            uploadedImages = uploadedImages.slice(0, MAX_IMAGES_PER_POST);
        }

        const validImages = await Promise.all(uploadedImages.map(imgFile => readImgFileContent(imgFile)));
        console.log('validImages', validImages);
        setImageFiles(validImages);
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
            <div className='preview-images'>
                {
                    imageFiles.filter(it => it.result != null).map((imgFileUrl) => <Img key={imgFileUrl.name}
                                                                                        src={imgFileUrl.result}/>)
                }
            </div>
            <div className='publish'>
                <div className='image'>
                    <input type='file' name='file' id='file' multiple onChange={onInputImgsHandler}
                           accept=".png, .jpg, .jpeg"/>
                    <label htmlFor='file'><i className="far fa-images"/></label>
                </div>
                <div className='post'>
                    <button className='post-btn' disabled={text.length === 0 && imageFiles.length === 0}
                            onClick={handleClick}>Post
                    </button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: AppState) => {
    return {userId: state.auth.userId};
};

export default connect(mapStateToProps, {createPost})(CreatePost)