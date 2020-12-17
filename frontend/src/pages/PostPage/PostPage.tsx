import React, {useEffect} from 'react';
import Post from "../../components/Post/Post";
import {LegalInfo} from "../../components/Legalnfo/LegalInfo";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import {loadPost} from "../../modules/Posts/postActions";
import {ThreeSectionsPage} from "../layouts/3Sections/3SectionsPage";
import styles from './styles.module.scss'

export const PostPage = () => {
    const {postId} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        postId && dispatch(loadPost(postId))
    }, [postId, dispatch])

    return (<ThreeSectionsPage MainComponents={
        <div className={styles.mainSection}>
            <Post postId={postId} key={postId}/>
        </div>
    } RightComponents={
        <>
            <LegalInfo/>
        </>
    }/>)
}