import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../Post/Post";
// @ts-ignore
import Spinner from 'react-spinkit';
import styles from "./styles.module.scss";
import { AppState } from "../../modules/rootReducer";
import { loadPosts } from "../../modules/Posts/postActions";
import classNames from "classnames";

export const NewsFeed = () => {
    const dispatch = useDispatch()
    const currentSection = useSelector((state: AppState) => state.newsFeed.currentSection)
    const postsIds = useSelector((state: AppState) => state.newsFeed[currentSection].postIds)
    const isLoadingPosts = useSelector((state: AppState) => state.newsFeed[currentSection].isLoadingPosts)

    const loader = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(loadPosts())
    }, [dispatch]);

    useEffect(() => {
        var options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) observer.observe(loader.current)
    }, []);

    // here we handle what happens when user scrolls to Load More div
    // in this case we just update page variable
    const handleObserver = (entities: any) => {
        const target = entities[0];
        if (target.isIntersecting) {
            console.log('is intersecting');
            dispatch(loadPosts())
        }
    }

    return (
        <div className={styles.newsFeed}>
            {postsIds?.map((postId: string) => <Post postId={postId} key={postId} />)}
            <div className={styles.loading} ref={loader}>
                <Spinner name="ball-spin-fade-loader" color="aqua" className={classNames({ 'hide': !isLoadingPosts })} />
            </div>
        </div>
    );
};