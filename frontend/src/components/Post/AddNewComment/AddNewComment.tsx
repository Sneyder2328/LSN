import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../modules/rootReducer';
import { ProfilePhoto } from "../../ProfilePhoto/ProfilePhoto";
import { TextEditor } from "../../shared/TextEditor";
import styles from './styles.module.scss'

export type AddNewCommentProps = {
    profilePhotoUrl?: string;
    shouldFocusTextEditor: () => (boolean);
    onCommentContentChanged: (value: string) => void;
    onSubmitComment: () => void;
}
export const AddNewComment: React.FC<AddNewCommentProps> = ({ onCommentContentChanged, shouldFocusTextEditor, onSubmitComment }) => {
    const userId = useSelector((appState: AppState) => appState.auth.userId)
    const users = useSelector((appState: AppState) => appState.users.entities)
    const user = users[userId||'']

    return (<div className={styles.newComment}>
        <ProfilePhoto
            className={styles.avatar} size={'small1'}
            url={user?.profilePhotoUrl} />
        <div className={styles.commentEditorContainer}>
            <TextEditor focusWhen={shouldFocusTextEditor} onChange={onCommentContentChanged}
                placeholder='Write a comment'
                className={styles.commentEditor}
                onEnter={onSubmitComment}
                onEnterCleanUp={true} />
        </div>

    </div>)
}