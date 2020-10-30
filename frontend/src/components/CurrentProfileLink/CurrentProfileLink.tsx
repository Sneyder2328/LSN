import {useSelector} from "react-redux";
import {AppState} from "../../modules/rootReducer";
import {Link} from "react-router-dom";
import {ProfilePhoto} from "../ProfilePhoto/ProfilePhoto";
import styles from './styles.module.scss'
import React from "react";
import classNames from "classnames";

type Props = {
    className?: string;
}
export const CurrentProfileLink: React.FC<Props> = ({className}) => {
    const userId: string = useSelector((state: AppState) => state.auth.userId!!)
    const users = useSelector((state: AppState) => state.entities.users.entities)
    const currentUser = users[userId]

    if (!currentUser) return null

    return (
        <Link to={`/${currentUser.username}`} className={classNames(className, styles.currentProfileLink)}>
            <ProfilePhoto url={currentUser.profilePhotoUrl} className={styles.profilePhoto} size={'small3'}
                          border={false}/>
            <span style={{
                color: '#fff',
                fontSize: '1rem',
                marginLeft: '6px',
                fontWeight: 600,
            }}>{currentUser && currentUser.fullname}</span>
        </Link>)
}