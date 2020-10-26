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

}
export const Dropdown: React.FC<DropdownProps> & { Item: React.FC<DropdownItemProps>; } = ({children}) => {
    const [open, setOpen] = useState<boolean>(false)
    const ref = useRef(null);
    useOnClickOutside(ref, () => {
        setOpen(false)
    });

    return (<div className={styles.dropdown} ref={ref}>
        {
            React.Children.map(children, (child) => {
                // @ts-ignore
                if (isValidElement(child) && child?.type?.name !== 'DropDownItem') {
                    return cloneElement(child, {
                        onClick: () => setOpen(!open)
                    })
                }
                return null;
            })
        }
        <div className={classNames(styles.dropdownMenu, {[styles.show]: open})}>
            {
                React.Children.map(children, (child) => {
                    // @ts-ignore
                    if (isValidElement(child) && child?.type?.name === 'DropDownItem') {
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