import React from 'react';
import {ProfilePhoto} from "../../ProfilePhoto/ProfilePhoto";
import {TextEditor} from "../../shared/TextEditor";
import styles from './styles.module.scss'

export type AddNewCommentProps = {
    profilePhotoUrl?: string;
    shouldFocusTextEditor: () => (boolean);
    onCommentContentChanged: (value: string) => void;
    onSubmitComment: () => void;
}
export const AddNewComment: React.FC<AddNewCommentProps> = ({profilePhotoUrl, onCommentContentChanged, shouldFocusTextEditor, onSubmitComment}) => {
    return (<div className={styles.newComment}>
        <ProfilePhoto
            className={styles.avatar} size={'small1'}
            url={profilePhotoUrl}/>
        <div className={styles.commentEditorContainer}>
            <TextEditor focusWhen={shouldFocusTextEditor} onChange={onCommentContentChanged}
                        placeholder='Write a comment'
                        className={styles.commentEditor}
                        onEnter={onSubmitComment}
                        onEnterCleanUp={true}/>
        </div>

    </div>)
}