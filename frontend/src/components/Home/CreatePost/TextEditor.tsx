import React, {FormEvent, useEffect, useRef, useState} from "react";
import classnames from "classnames";
import {useStateValue} from "../../../contexts/StateContext";
import {TYPES} from "../../../reducers";

type Props = {
    onChange: (text: string) => void;
};

export const TextEditor: React.FC<Props> = ({onChange}) => {
    const [text, setText] = useState<string>('');

    const editorRef: any = useRef<HTMLDivElement>(null);

    // @ts-ignore
    const {state: {post}} = useStateValue();

    useEffect(() => {
        if (post.newPostStatus === TYPES.POST_CREATED) {
            cleanUpTextEditor();
        }
    }, [post.newPostStatus]);

    useEffect(() => {
        onChange(text);
        if (text.length === 1 && text.includes('\n')) // if div is like <div><br/></div> clean it up
            cleanUpTextEditor();
    }, [text]);

    const cleanUpTextEditor = () => {
        editorRef.current.innerText = '';
        setText('');
    };

    /**
     * Paste text with plain/text format in the text editor, important to avoid
     * @param e
     */
    const pastePlainText = (e: FormEvent) => {
        e.preventDefault();
        // get text representation of clipboard
        let text = ((e as any).originalEvent || e).clipboardData.getData('text/plain');
        // replace line breaks with <br> for proper formatting in html
        text = text.replace(/\n/g, '<br>');
        // insert text manually
        document.execCommand("insertHTML", false, text);
    };

    return (
        <div id='editor' ref={editorRef} contentEditable="true"
             onInput={(e: FormEvent) => setText((e.target as HTMLDivElement).innerText)}
             onPaste={pastePlainText}
             placeholder="What's happening?" className={
            classnames(
                {'medium': text.length > 35 || text.includes('\n')},
                {'small': text.length > 100}
            )}/>
    );
};