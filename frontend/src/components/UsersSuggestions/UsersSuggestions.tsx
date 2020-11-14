import React, {useEffect} from "react";
import styles from './styles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {fetchUsersSuggestions} from "../../modules/User/userActions";
import {AppState} from "../../modules/rootReducer";
import {UserSuggested} from "./UserSuggested";

export const UsersSuggestions = () => {
    const dispatch = useDispatch()
    const {suggestions} = useSelector((state: AppState) => state.entities.users)
    useEffect(() => {
        dispatch(fetchUsersSuggestions())
    }, [fetchUsersSuggestions, dispatch])

    if (suggestions.length === 0) return null

    return (<div className={styles.suggestions}>
        <h3 className={styles.title}>People you may know</h3>
        <div className={styles.list}>
            {suggestions.map((suggestion) => (<UserSuggested key={suggestion.userId} suggestion={suggestion}/>))}
        </div>
    </div>)
}