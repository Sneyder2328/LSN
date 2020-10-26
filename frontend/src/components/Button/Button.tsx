import React from 'react';
import styles from './styles.module.scss'

export type ButtonProps = {
    onClick?: () => void;
    className?: string;
    label: string;
    // isLoading?: boolean TODO(Add this feature, when isLoading is set to true display a spinner instead of the label)
}
export const Button: React.FC<ButtonProps> = ({onClick,className, label, ...rest}) => {
    return (
        <button
            type={'button'}
            className={[styles.button, className].join(' ')}
            onClick={onClick} {...rest}>
            {label}
        </button>)
}