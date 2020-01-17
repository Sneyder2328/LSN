import React, {FormEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import classnames from "classnames";

type Props = {
    onChange: (text: string) => void;
    placeholder: string;
    cleanUpWhen?: () => boolean;
    onEnterCleanUp?: boolean;
    className?: string;
    onEnter?: () => any;
    focusWhen?: () => boolean;
};

export const TextEditor: React.FC<Props> = ({focusWhen, onChange, placeholder, cleanUpWhen, className, onEnter, onEnterCleanUp}) => {
    const [text, setText] = useState<string>('');
    const editorRef: any = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onChange(text);
        if (text.length === 1 && text.includes('\n')) // if div is like <div><br/></div> clean it up
            cleanUpTextEditor();
    }, [text]);

    const cleanUpTextEditor = () => {
        if (editorRef.current.innerText !== '') {
            editorRef.current.innerHTML = '';
            setText('');
        }
    };

    if (focusWhen && focusWhen()) {
        editorRef.current.focus();
    }

    if (cleanUpWhen && cleanUpWhen()) {
        cleanUpTextEditor();
    }

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

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (onEnter && e.keyCode === 13) {
            onEnter();
            if (onEnterCleanUp) {
                e.preventDefault();
                //document.execCommand("selectAll", false);
                //document.execCommand("cut", false);
                cleanUpTextEditor();
            }
        }
    };

    return (
        <div
            id='editor' ref={editorRef}
            contentEditable="true"
            onInput={(e: FormEvent) => setText((e.target as HTMLDivElement).innerText)}
            onPaste={pastePlainText}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={
                classnames(className,
                    {
                        'medium': text.length > 35 || text.includes('\n')
                    },
                    {
                        'small':
                            text.length > 100
                    }
                )
            }
        />
    );
};