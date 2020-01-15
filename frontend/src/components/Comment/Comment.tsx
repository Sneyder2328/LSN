import React from "react";
import {Profile} from "../Post/Post";
import './styles.scss'
// @ts-ignore
import moment from "moment-shortformat";
import {connect} from "react-redux";
import {AppState} from "../../reducers";
import {selectComment} from "./commentReducer";

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
}

type Props = {
    commentId: string;
    comment: CommentResponse
};
const Comment: React.FC<Props> = ({comment}) => {
    let diffInMillis = new Date().getTime() - new Date(comment.createdAt).getTime();
    const timePublished = moment(moment() + diffInMillis).short(true);
    return (
        <div className='comment'>
            <img className='avatar'
                 src={'https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'}
                 alt='comment pic'/>
            <div className='comment-box'>
                <div>
                    <p className='fullname'>{comment.authorProfile.fullname}</p>
                    <p className='username'>@{comment.authorProfile.username}</p>
                </div>
                <p className='content'>{comment.text}</p>
                <div className='interact-comment'>
                    <span>
                        <i className="fas fa-thumbs-up"/>{comment.likesCount !== 0 && comment.likesCount}
                    </span>
                    <span>
                        <i className="fas fa-thumbs-down"/>{comment.dislikesCount !== 0 && comment.dislikesCount}
                    </span>
                    <p className='time-published'>{timePublished}</p>
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
export default connect(makeMapStateToProps)(Comment)