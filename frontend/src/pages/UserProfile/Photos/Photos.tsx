import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../../modules/rootReducer";
import {fetchPhotos} from "../../../modules/User/userActions";
import styles from './styles.module.scss'
import {Photo} from "./Photo";

export const Photos: React.FC<{ userId?: string }> = ({userId}) => {
    const dispatch = useDispatch()
    const usersMetadata = useSelector((state: AppState) => state.entities.users.metas)

    useEffect(() => {
        userId && dispatch(fetchPhotos(userId))
    }, [userId, dispatch])

    if (!userId) return null
    const photos = usersMetadata[userId]?.photos || []

    return (<div className={styles.photos}>
        <h3 className={styles.title}>Photos ({photos.length})</h3>
        <div className={styles.list}>
            {photos?.map((photo)=> <Photo photo={photo}/>)}
        </div>
    </div>)
}