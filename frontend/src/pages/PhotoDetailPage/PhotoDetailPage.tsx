import React, {useEffect, useState} from 'react';
import {NavBar} from "../../components/NavBar/NavBar";
import styles from './styles.module.scss'
import {BottomMsgsBar} from "../../components/BottomMessagingBar/BottomMsgsBar";
import {useHistory, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {loadPostByPhoto} from "../../modules/Posts/postActions";
import {AppState} from "../../modules/rootReducer";
import Post from "../../components/Post/Post";
import {NotificationSystem} from "../../components/NotificationSystem/NotificationSystem";
import classNames from "classnames";
import {transformUrlForPostImage} from "../../modules/Posts/postApi";
import {photoLink} from "../../api";

export const PhotoDetailPage = () => {
    const {photoId} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        photoId && dispatch(loadPostByPhoto(photoId))
    }, [photoId, dispatch])
    const postsIdsByPhotoId = useSelector((state: AppState) => state.posts.postsIdsByPhotoId)
    const postId = postsIdsByPhotoId[photoId]?.postId
    const posts = useSelector((state: AppState) => state.posts.entities)
    const post = posts[postId]
    const history = useHistory()

    const getIndexByPhotoId = (photoId: string) => {
        const index = post?.images.findIndex((img) => img.id === photoId);
        console.log('getIndexByPhotoId', photoId, post?.images, index)
        return index
    }
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null)

    useEffect(() => {
        setCurrentPhotoIndex(getIndexByPhotoId(photoId))
    }, [post])

    useEffect(() => {
        if (currentPhotoIndex != null) {
            history.push(photoLink(post.images[currentPhotoIndex].id))
        }
    }, [currentPhotoIndex])

    const canMoveRight = () => currentPhotoIndex != null && currentPhotoIndex < post.images.length - 1;

    const slideRight = () => {
        if (canMoveRight()) setCurrentPhotoIndex(currentPhotoIndex! + 1)
    }

    const canMoveLeft = () => currentPhotoIndex != null && currentPhotoIndex > 0;

    const slideLeft = () => {
        if (canMoveLeft()) setCurrentPhotoIndex(currentPhotoIndex! - 1)
    }
    return (
        <div style={{height: '100%'}}>
            <NavBar/>
            <main className='page-outer'>
                <div className={styles.pageContainer}>
                    <div className={styles.leftSection}>
                        <LeftArrow display={canMoveLeft()} onClick={slideLeft}/>
                        {currentPhotoIndex != null &&
                        <img src={transformUrlForPostImage(post.images[currentPhotoIndex].url)}
                             className={styles.image}/>}
                        <RightArrow display={canMoveRight()} onClick={slideRight}/>
                    </div>
                    <div className={styles.rightSection}>
                        <div>
                            <Post postId={postId} key={postId} className={styles.post} displayImages={false}/>
                        </div>
                    </div>
                </div>
            </main>
            <BottomMsgsBar/>
            <NotificationSystem/>
        </div>
    );
}

const LeftArrow: React.FC<{ display: boolean; onClick: Function }> = ({onClick, display}) => (
    <div className={styles.arrowWrapper} onClick={() => onClick()}>
        <i className={classNames('fa fa-angle-left fa-3x', styles.arrow, {'hide': !display})}
           aria-hidden='true'/>
    </div>
);

const RightArrow: React.FC<{ display: boolean; onClick: Function }> = ({onClick, display}) => (
    <div className={classNames(styles.arrowWrapper, styles.wrapperRight)} onClick={() => onClick()}>
        <i className={classNames('fa fa-angle-right fa-3x', styles.arrow, {'hide': !display})}
           aria-hidden='true'/>
    </div>
);

