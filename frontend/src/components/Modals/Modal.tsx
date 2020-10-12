import React, {cloneElement, isValidElement, useEffect} from "react";
import styles from "./modal.module.scss"
import {ModalHeader} from "./ModalHeader";
import {ModalContent} from "./ModalContent";

type Props = {
    onClose: () => any;
    onSave: () => any;
    id?: string;
    className?: string;
};

export const Modal: React.FC<Props> & { Header: any; Content: any } = ({onClose, onSave, children, id,className}) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.keyCode === 27) {
            onClose();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, []);

    const onSubmit = (event: any) => {
        console.log("event=", event);
        event.preventDefault();
        onSave();
    }

    return (
        <div className={styles.modalBackground} id={id}>
            <form className={styles.modalContainer + ' ' + className} onSubmit={onSubmit}>
                {
                    React.Children.map(children, (child) => {
                        if (isValidElement(child)) {
                            return cloneElement(child, {
                                onClose
                            })
                        }
                        return child;
                    })
                }
                <div className={styles.modalFooter}>
                    <button className={styles.cancel} type="button" onClick={onClose}>Cancel</button>
                    <button className={styles.save} type='submit'>Save</button>
                </div>
            </form>
        </div>
    );
};

Modal.Header = ModalHeader;
Modal.Content = ModalContent;