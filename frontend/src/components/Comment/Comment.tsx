import React from "react";
import {Profile} from "../Post/Post";
import './styles.scss'
import {connect} from "react-redux";
import {AppState} from "../../reducers";
import {selectComment} from "./commentReducer";
import {useTimeSincePublishedShort} from "../../hooks/updateRelativeTimeHook";
import {dislikeComment, likeComment} from "./commentActions";
import classNames from "classnames";
import {ProfilePhoto} from "../commons/ProfilePhoto";

export interface CommentResponse {
    id: string;
    userId: string;
    postId: string;
    type: 'text' | 'img';
    text: string;
    img: string;
    createdAt: string;
    likesCount: number;
    dislikesCount: number;
    authorProfile: Profile;
    likeStatus: 'like' | 'dislike' | undefined;
}

type Props = {
    commentId: string;
    comment: CommentResponse;
    likeComment: (commentId: string, undo: boolean) => any;
    dislikeComment: (commentId: string, undo: boolean) => any;
};
const Comment: React.FC<Props> = ({comment, likeComment, dislikeComment}) => {
    const timeSincePublished = useTimeSincePublishedShort(comment.createdAt);

    return (
        <div className='comment'>
            <ProfilePhoto url={comment.authorProfile.profilePhotoUrl} className='avatar'/>
            <div className='comment-box'>
                <div>
                    <a className='fullname' href={`/${comment.authorProfile.username}`}>
                        <p>{comment.authorProfile.fullname}</p></a>
                    <p className='username'>@{comment.authorProfile.username}</p>
                </div>
                <p className='content'>{comment.text}</p>
                <div className='interact-comment'>
                    <span onClick={() => likeComment(comment.id, comment.likeStatus === 'like')}
                          className={classNames({'selected': comment.likeStatus === 'like'})}>
                        <i className="fas fa-thumbs-up"/>{comment.likesCount !== 0 && comment.likesCount}
                    </span>
                    <span onClick={() => dislikeComment(comment.id, comment.likeStatus === 'dislike')}
                          className={classNames({'selected': comment.likeStatus === 'dislike'})}>
                        <i className="fas fa-thumbs-down"/>{comment.dislikesCount !== 0 && comment.dislikesCount}
                    </span>
                    <p className='time-published'>{timeSincePublished}</p>
                </div>
            </div>
        </div>
    );
};
const makeMapStateToProps = () => {
    const commentSelector = selectComment();
    return (state: AppState, ownProps: { commentId: string }) => {
        return {
            comment: commentSelector(state, ownProps.commentId)
        };
    };
};
export default connect(makeMapStateToProps, {likeComment, dislikeComment})(Comment)