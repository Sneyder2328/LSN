import React from "react";
import {PhotoObject} from "../../../modules/User/userReducer";
import {photoLink} from "../../../api";
import {Link} from "react-router-dom";
import styles from './styles.module.scss'

export const Photo: React.FC<{ photo: PhotoObject }> = ({photo}) => {
    return (<Link to={photoLink(photo.id)}>
        <img src={photo.url} className={styles.photo}/>
    </Link>)
}