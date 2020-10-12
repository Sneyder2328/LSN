import React from "react";
import styles from "./modal.module.scss"

type Props = {
    onClose?: () => any;
    className?: string;
};
export const ModalContent: React.FC<Props> = ({children, className, ...props}) => {
    return <div className={styles.modalContent + ' ' + className} {...props}>
        {children}
    </div>;
}