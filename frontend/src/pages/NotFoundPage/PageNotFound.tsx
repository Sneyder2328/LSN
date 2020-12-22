import React from "react";
import { LegalInfo } from "../../components/Legalnfo/LegalInfo";
import { Trends } from "../../components/Trends/Trends";
import { ThreeSectionsPage } from "../layouts/3Sections/3SectionsPage";
import styles from './styles.module.scss'

export const NotFoundPage = () => {

    return (<ThreeSectionsPage LeftComponents={
        <>
            <Trends/>
        </>
    } MainComponents={
        <div className={styles.container}>
            <h2 className={styles.title}>Not found(404)</h2>
            <h4 className={styles.subtitle}>Sorry, the page your are looking for does not exist.</h4>
        </div>
    } RightComponents={
        <>
            <LegalInfo/>
        </>
    } />)
};