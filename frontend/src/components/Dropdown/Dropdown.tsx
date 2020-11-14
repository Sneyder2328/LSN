import React, {cloneElement, FC, isValidElement, useRef, useState} from 'react';
import styles from './styles.module.scss'
import classNames from "classnames";
import useOnClickOutside from "use-onclickoutside";

type DropdownItemProps = {
    icon?: FC;
    label: string;
    onSelected?: () => void;
    onClick?: () => void;
};
const DropDownItem: React.FC<DropdownItemProps> = ({icon, label, onSelected, onClick}) => {
    const Icon = icon ? icon : () => <i/>
    return (<a onClick={() => {
        onSelected && onSelected()
        onClick && onClick()
    }}><Icon/><span>{label}</span></a>)
}


export type DropdownProps = {
    trigger: any;
    title?: string;
    className?: string;
}
export const Dropdown: React.FC<DropdownProps> & { Item: React.FC<DropdownItemProps>; }
= ({className, trigger, title, children}) => {
    const [open, setOpen] = useState<boolean>(false)
    const ref = useRef(null);
    useOnClickOutside(ref, () => {
        setOpen(false)
    });

    return (<div className={classNames(styles.dropdown)} ref={ref}>
        {
            cloneElement(trigger, {
                onClick: () => setOpen(!open)
            })
        }
        <div className={classNames(styles.dropdownMenu, className, {[styles.show]: open})}>
            {title && <span className={styles.title}>{title}</span>}
            {
                React.Children.map(children, (child) => {
                    // @ts-ignore
                    if (isValidElement(child)) {
                        return cloneElement(child, {
                            onSelected: () => setOpen(!open)
                        })
                    }
                    return null;
                })
            }
        </div>
    </div>)
}
Dropdown.Item = DropDownItem