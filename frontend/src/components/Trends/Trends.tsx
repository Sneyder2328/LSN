import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { trendsLink } from '../../api';
import { AppState } from '../../modules/rootReducer';
import { loadTrends } from '../../modules/Trends/trendsActions';
import styles from './styles.module.scss'

export const Trends = () => {
    const { listTrends } = useSelector((state: AppState) => state.trends)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(loadTrends())
    }, [])

    return (<div className={styles.trends}>
        <h3 className={styles.title}>Trends</h3>
        <div className={styles.list}>
            {listTrends.map((trend) => (
                <Link to={trendsLink(trend)} key={trend}>
                    <span className={styles.hashtag}>#{trend}</span>
                </Link>))}
        </div>
    </div>)
}