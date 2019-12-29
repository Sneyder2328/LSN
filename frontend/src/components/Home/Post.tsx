import React from "react";
import moment from "moment";

interface Profile {
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

interface PostDetails extends Post {
    comments: number;
    likes: number;
    userId: string;
    createdAt: any;
    id: string;
    Profile: Profile;
}

interface Props {
    post: PostDetails
}

export const Post: React.FC<Props> = ({post}) => {
    console.log(post.createdAt);
    let timePublished = moment(new Date(post.createdAt).getTime()).fromNow();
    return (
        <div className='post'>
            <div className='userProfile'>
                <img id='avatar'
                     src={post.Profile.profilePhotoUrl || 'https://miro.medium.com/max/280/1*MccriYX-ciBniUzRKAUsAw.png'}
                     alt='post pic'/>
                <div>
                    <p id='fullname'>{post.Profile.fullname}</p>
                    <p id='time-published'>{timePublished}</p>
                </div>
            </div>
            <p className='content'>{post.text}</p>
        </div>
    );
};