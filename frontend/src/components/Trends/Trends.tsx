import React from 'react';
import styles from './styles.module.scss'

export const Trends = ()=>{
    return (<div className={styles.trends}>
        <h3 className={styles.title}>Trends</h3>
        <div className={styles.list}>
            <span className={styles.hashtag}>#30Octubre</span>
            <span className={styles.hashtag}>#HappyNewYear</span>
            <span className={styles.hashtag}>#Tech</span>
        </div>
    </div>)
}