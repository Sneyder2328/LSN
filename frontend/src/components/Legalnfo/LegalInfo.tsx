import React from "react";
import styles from './styles.module.scss'

export const LegalInfo = ()=>{
    return (<div className={styles.legalInfo}>
        <div className={styles.links}>
            <a>Privacy</a>
            <a>Terms</a>
            <a>Cookies</a>
            <a>Licenses</a>
        </div>
        <p>Copyright © 2020 Sneyder Angulo.</p>
    </div>)
}