import React from "react";
import styles from "./modal.module.scss"

type HeaderProps = {
    onClose?: () => any;
};
export const ModalHeader: React.FC<HeaderProps> = ({onClose, children}) => {
    return <div className={styles.modalHeader}>
        <h2>{children}</h2>
        <button type="button" onClick={onClose}><i className="fas fa-times"/></button>
    </div>;
}