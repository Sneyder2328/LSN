import React, {useState} from "react";
import moment from "moment";
import './styles.scss'
// @ts-ignore
import uuidv4 from "uuid/v4";
import {TextEditor} from "../CreatePost/TextEditor";
import {CommentRequest} from "../Comment/commentApi";
import {createComment, loadPreviousComments} from "../Comment/commentActions";
import {Comment, CommentResponse} from "../Comment/Comment"
import {connect} from "react-redux";
import classNames from "classnames";
import {compareByDateDesc} from "../../utils/utils";

export interface Profile {
    coverPhotoUrl: string;
    profilePhotoUrl: string;
    description: string;
    fullname: string;
    username: string;
}

export interface Post {
    text: string;
    type: string;
    img: string;
}

export interface PostResponse extends Post {
    commentsCount: number;
    likesCount: number;
    dislikesCount: number;
    userId: string;
    createdAt: any;
    id: string;
    authorProfile: Profile;
    currentUserLikeStatus: 'like' | 'dislike' | undefined;
    loadingPreviousComments?: boolean;
    isCreatingComment?: boolean;
    comments: Array<CommentResponse>;
}

type Props = {
    postResponse: PostResponse;
    createComment: (commentData: CommentRequest) => any;
    loadPreviousComments: (postId: string, offset: number, limit: number) => any;
};

const Post: React.FC<Props> = ({postResponse, createComment, loadPreviousComments}) => {
    const timePublished = moment(new Date(postResponse.createdAt).getTime()).fromNow();
    const [commentText, setCommentText] = useState<string>('');

    const submitComment = () => {
        if (commentText.trim() !== '') {
            const newComment: CommentRequest = {
                id: uuidv4(),
                img: '',
                text: commentText,
                postId: postResponse.id,
                type: 'text'
            };
            createComment(newComment)
        }
    };

    const loadMoreComments = () => {
        console.log('load comments for post ', postResponse.id, postResponse.comments.length);
        loadPreviousComments(postResponse.id, postResponse.comments.length, 10);
    };

    return (
        <div className='post'>
            <div className='userProfile'>
                <img className='avatar'
                     src={postResponse.authorProfile.profilePhotoUrl || 'https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'}
                     alt='post pic'/>
                <div>
                    <p className='fullname'>{postResponse.authorProfile.fullname}</p>
                    <p className='username'>@{postResponse.authorProfile.username}</p>
                    <p className='time-published'>{timePublished}</p>
                </div>
            </div>
            <p className='content'>{postResponse.text}</p>
            <div className='interact'>
                <span>
                    <i className="fas fa-thumbs-up"/>{postResponse.likesCount !== 0 && postResponse.likesCount}
                </span>
                <span>
                    <i className="fas fa-thumbs-down"/>{postResponse.dislikesCount !== 0 && postResponse.dislikesCount}
                </span>
                <span>
                    <i className="fas fa-comment"/>
                </span>
                <span>
                    <i className="fas fa-share"/>
                </span>
            </div>
            <div
                className={classNames('load-previous-comments', {'hide': postResponse.commentsCount === postResponse.comments.length})}>
                <span onClick={loadMoreComments}>
                    <i className="showMoreComments fas fa-angle-up"/>
                    Load more comments
                    <i className={classNames('loadingComments fas fa-spinner fa-pulse', {'hide': !postResponse.loadingPreviousComments})}/>
                </span>
            </div>
            <div className={classNames('comments-container', {'hide': postResponse.comments.length === 0})}>
                {postResponse.comments.sort(compareByDateDesc).map(comment => (
                    <Comment key={comment.id} comment={comment}/>))}
            </div>
            <div className='new-comment'>
                <img className='avatar'
                     src={postResponse.authorProfile.profilePhotoUrl || 'https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'}
                     alt='post pic'/>
                <div className='comment-editor-container'>
                    <TextEditor onChange={setCommentText} placeholder='Write a comment' className='comment-editor'
                                onEnter={submitComment} onEnterCleanUp={true}/>
                </div>

            </div>
        </div>
    );
};

export default connect(null, {createComment, loadPreviousComments})(Post);