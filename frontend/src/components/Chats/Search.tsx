import React from 'react';
import styles from './styles.module.scss'
import classNames from "classnames";

export const Search: React.FC<{className?: string}> = ({className})=>{
    return (<div className={classNames(styles.search, className)}>
        <i className="fas fa-search"/>
        <input className={styles.searchInput} placeholder={'Search'}/>
    </div>)
}