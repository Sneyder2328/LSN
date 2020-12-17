import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import classNames from "classnames";
import {useTimeSincePublished} from "../../hooks/updateRelativeTimeHook";
import {genUUID, ImageFile, readImgFileContent} from "../../utils/utils";
import styles from './styles.module.scss'
import {CommentsWrapper} from "../Comment/CommentsWrapper";
import {PostImage, selectPost} from "../../modules/Posts/postReducer";
import {CommentRequest} from "../../modules/Comment/commentApi";
import {AppState} from "../../modules/rootReducer";
import {createComment, loadPreviousComments} from "../../modules/Comment/commentActions";
import {dislikePost, likePost} from "../../modules/Posts/postActions";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import {AddNewComment} from "./AddNewComment/AddNewComment";
import {Link} from "react-router-dom";
import {photoLink, postLink, userLink} from "../../api";
import {transformUrlForPostImage} from "../../modules/Posts/postApi";

export interface Profile {
    userId: string;
    coverPhotoUrl: string;
    profilePhotoUrl: string;
    description: string;
    fullname: string;
    username: string;
}

export interface Post {
    id: string;
    text: string;
}

export interface PostRequest extends Post {
    imageFiles: Array<File>;
    userId: string;
}

export interface PostResponse extends Post {
    id: string;
    userId: string;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
    createdAt: any;
    likeStatus: 'like' | 'dislike' | undefined;
    authorProfile: Profile;
    images: Array<PostImage>;
    previewImages?: Array<File>;
    comments: Array<string>;
    isLoadingPreviousComments?: boolean;
    isCreatingComment?: boolean;
    isUploading?: boolean;
}

type Props = {
    postId: string;
    postResponse: PostResponse;
    createComment: (commentData: CommentRequest) => any;
    loadPreviousComments: (postId: string, offset: number, limit: number) => any;
    likePost: (postId: string, undo: boolean) => any;
    dislikePost: (postId: string, undo: boolean) => any;
    className?: string;
    displayImages?: boolean;
};


const Post: React.FC<Props> = ({postResponse, createComment, loadPreviousComments, likePost, dislikePost, displayImages, className}) => {
    const timeSincePublished = useTimeSincePublished(postResponse?.createdAt);
    const [commentText, setCommentText] = useState<string>('');
    const [focusInput, setFocusInput] = useState<boolean>(false);
    const [previewImageResults, setPreviewImageResults] = useState<Array<string>>();

    useEffect(() => {
        const waitForPreviewOfImages = async (): Promise<Array<ImageFile> | undefined> => {
            if (postResponse.previewImages) {
                return await Promise.all(postResponse.previewImages.map((imgFile) => readImgFileContent({
                    name: '',
                    file: imgFile
                })));
            }
        };
        postResponse.previewImages && waitForPreviewOfImages().then((previewImgs) => {
            if (previewImgs) {
                setPreviewImageResults(previewImgs.filter((prevImg) => prevImg.result != null).map((prevImg) => prevImg.result!));
            }
        });
    }, [postResponse.previewImages]);

    const submitComment = () => {
        if (commentText.trim() === '') return
        const newComment: CommentRequest = {
            id: genUUID(),
            img: '',
            text: commentText,
            postId: postResponse.id,
            type: 'text'
        };
        createComment(newComment)
    };

    const loadMoreComments = () => {
        loadPreviousComments(postResponse.id, postResponse.comments.length, 10);
    };

    const shouldFocusTextEditor = () => {
        if (focusInput) {
            setFocusInput(false);
            return true;
        }
        return false;
    };

    return (
        <div className={classNames(styles.post, className)}>
            <div className={styles.userProfile}>
                <ProfilePhoto
                    className={styles.avatar} size={"small1"}
                    url={postResponse?.authorProfile?.profilePhotoUrl}/>
                <div>
                    <Link to={userLink(postResponse?.authorProfile?.username)} className={styles.fullname}>
                        <p>{postResponse?.authorProfile?.fullname}</p>
                    </Link>
                    <p className={styles.username}>@{postResponse?.authorProfile?.username}</p>
                    <Link to={postLink(postResponse.id)} className={styles.linkPost}>
                        <p className={styles.timePublished}>{timeSincePublished}</p>
                    </Link>
                </div>
            </div>
            <div className={classNames(styles.content, {[styles.uploading]: postResponse.isUploading})}>
                <p className={styles.text}>{postResponse.text}</p>
                {displayImages !== false && <div className='images'>
                    {postResponse?.images?.map(image => {
                        return (
                            <Link to={photoLink(image.id)} key={image.url}>
                                <img src={transformUrlForPostImage(image.url)}/>
                            </Link>)
                    })}
                </div>
                }

                {displayImages !== false && <div className='preview-images'>
                    {
                        postResponse?.images?.length === 0 && previewImageResults && previewImageResults.map((imgFile, index) => (
                            <img key={index} src={imgFile}/>))
                    }
                </div>
                }

            </div>
            <div className={styles.interact}>
                <span onClick={() => likePost(postResponse.id, postResponse.likeStatus === 'like')}
                      className={classNames({[styles.selected]: postResponse.likeStatus === 'like'})}>
                    <i className="fas fa-thumbs-up"/>{postResponse.likesCount !== 0 && postResponse.likesCount}
                </span>
                <span onClick={() => dislikePost(postResponse.id, postResponse.likeStatus === 'dislike')}
                      className={classNames({[styles.selected]: postResponse.likeStatus === 'dislike'})}>
                    <i className="fas fa-thumbs-down"/>{postResponse.dislikesCount !== 0 && postResponse.dislikesCount}
                </span>
                <span onClick={() => setFocusInput(true)}>
                    <i className="fas fa-comment"/>
                </span>
                <span>
                    <i className="fas fa-share"/>
                </span>
            </div>
            <div
                className={classNames(styles.loadPreviousComments, {'hide': postResponse?.commentsCount === postResponse?.comments?.length})}>
                <span onClick={loadMoreComments}>
                    <i className={styles.showMoreComments + ' fas fa-angle-up'}/>
                    Load more comments
                    <i className={classNames(styles.loadingComments, 'fas fa-spinner fa-pulse', {'hide': !postResponse.isLoadingPreviousComments})}/>
                </span>
            </div>
            <CommentsWrapper comments={postResponse?.comments}/>
            <AddNewComment
                profilePhotoUrl={postResponse?.authorProfile?.profilePhotoUrl}
                shouldFocusTextEditor={shouldFocusTextEditor}
                onCommentContentChanged={setCommentText}
                onSubmitComment={submitComment}/>
        </div>
    );
};
const makeMapStateToProps = () => {
    const postSelector = selectPost();
    return (state: AppState, ownProps: { postId: string }) => {
        return {
            postResponse: postSelector(state, ownProps.postId)
        }
    };
};
export default connect(makeMapStateToProps, {createComment, loadPreviousComments, likePost, dislikePost})(Post);