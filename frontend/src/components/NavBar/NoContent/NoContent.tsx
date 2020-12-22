import React from 'react'
import classNames from "classnames";
import styles from './styles.module.scss'

export const NoContent: React.FC<{display: boolean}> = ({display}) => {
    return (<div className={classNames(styles.nothingToLoad, { 'hide': !display })}>
        <span>Nothing more to load</span>
    </div>)
}