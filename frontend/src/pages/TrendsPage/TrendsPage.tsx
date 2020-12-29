import React, { useEffect } from 'react';
import { LegalInfo } from "../../components/Legalnfo/LegalInfo";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ThreeSectionsPage } from "../layouts/3Sections/3SectionsPage";
import styles from './styles.module.scss'
import { loadPostsByTrend } from '../../modules/Trends/trendsActions';
import { Trends } from '../../components/Trends/Trends';
import { AppState } from '../../modules/rootReducer';
import Post from '../../components/Post/Post';

export const TrendsPage = () => {
    const { trend } = useParams()
    const dispatch = useDispatch()
    const trends = useSelector((state: AppState)=>state.trends.entities)
    const postIds = trends?.[trend]?.postsIds

    useEffect(() => {
        trend && dispatch(loadPostsByTrend(trend))
    }, [trend, dispatch])

    return (<ThreeSectionsPage LeftComponents={
        <>
            <Trends />
        </>
    } MainComponents={
        <div className={styles.mainSection}>
            {postIds?.map((postId: string) => <Post postId={postId} key={postId} />)}
        </div>
    } RightComponents={
        <>
            <LegalInfo />
        </>
    } />)
}