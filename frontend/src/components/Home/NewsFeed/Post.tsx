import React, {useEffect, useState} from "react";
import moment from "moment";
// @ts-ignore
import uuidv4 from "uuid/v4";
import {TextEditor} from "../CreatePost/TextEditor";
import {CommentRequest} from "../../../api/comment";
import {createComment} from "../../../actions/commentActions";
import {useStateValue} from "../../../contexts/StateContext";
import {Comment, CommentResponse} from "./Comment"
import {COMMENT_CREATED_SUCCESS} from "../../../actions/types";

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
    createCommentStatus?: 'CREATING_COMMENT' | 'COMMENT_CREATED_SUCCESS' | 'COMMENT_CREATED_ERROR';
    fetchCommentsStatus?: 'FETCHING_COMMENTS' | 'COMMENTS_FETCHED';
    comments?: Array<CommentResponse>;
}

export const Post: React.FC<{ postResponse: PostResponse }> = ({postResponse}) => {
    const timePublished = moment(new Date(postResponse.createdAt).getTime()).fromNow();
    const [commentText, setCommentText] = useState<string>('');

    const {state: {post}, dispatch} = useStateValue();

    useEffect(() => {
        console.log('post changed', post);
        // @ts-ignore
        const thing = post.posts.some(it => it.id === postResponse.id && it.createCommentStatus === COMMENT_CREATED_SUCCESS);
        if (thing)
            console.log('comment created for', postResponse);

    }, [post]);

    const submitComment = async () => {
        if (commentText.trim() !== '') {
            console.log('creating new comment');
            const newComment: CommentRequest = {
                id: uuidv4(),
                img: '',
                text: commentText,
                postId: postResponse.id,
                type: 'text'
            };
            await createComment(dispatch, newComment)
        }
    };

    // @ts-ignore
    //const cleanUpCondition = post.posts.some(it => it.id === postResponse.id && it.createCommentStatus === COMMENT_CREATED_SUCCESS);

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
            <div className='comments-container'>
                {postResponse.comments?.map(comment => (<Comment key={comment.id} comment={comment}/>))}
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