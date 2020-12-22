import React, { useEffect, useRef } from 'react'
import styles from './styles.module.scss'
import classNames from "classnames";
// @ts-ignore
import Spinner from 'react-spinkit';
import { AppState } from '../../../modules/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../../../components/Post/Post';
import { loadPostsByUser } from '../../../modules/Posts/postActions';

type Props = {
    userId?: string
}
export const Posts: React.FC<Props> = ({ userId }) => {
    const dispatch = useDispatch()
    const loader = useRef<HTMLDivElement>(null);
    const posts = useSelector((state: AppState) => state.posts.users)

    useEffect(() => {
        if (!userId) return
        var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) observer.observe(loader.current)
    }, [userId]);

    // here we handle what happens when user scrolls to Load More div
    // in this case we just update page variable
    const handleObserver = (entities: any) => {
        const target = entities[0];
        if (target.isIntersecting) {
            console.log('is intersecting in user profile', userId);
            userId && dispatch(loadPostsByUser(userId))
        }
    }

    const userPosts: string[] | undefined = userId ? posts?.[userId]?.ids : undefined
    const allPostsLoaded = userId ? posts?.[userId]?.allPostsLoaded : undefined

    return (<div>
        {userPosts?.map((postId: string) => <Post postId={postId} key={postId} />)}
        <div className={styles.loading} ref={loader}>
            <Spinner name="ball-spin-fade-loader" color="aqua" className={classNames({ 'hide': allPostsLoaded === true })} />
        </div>
    </div>)
}