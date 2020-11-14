import React from "react";
import {Profile} from "../Post/Post";
import './styles.scss'
import {connect} from "react-redux";
import {useTimeSincePublishedShort} from "../../hooks/updateRelativeTimeHook";
import classNames from "classnames";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import {selectComment} from "../../modules/Comment/commentReducer";
import {AppState} from "../../modules/rootReducer";
import {dislikeComment, likeComment} from "../../modules/Comment/commentActions";
import {Link} from "react-router-dom";

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
            <ProfilePhoto url={comment.authorProfile.profilePhotoUrl} className='avatar' size={'small2'}/>
            <div className='comment-box'>
                <div>
                    <Link to={`/${comment.authorProfile.username}`} className={'fullname'}>
                        <p>{comment.authorProfile.fullname}</p>
                    </Link>
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