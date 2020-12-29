import React, { cloneElement, FC, isValidElement, useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss'
import classNames from "classnames";
import useOnClickOutside from "use-onclickoutside";
import { Scrollbar } from "react-scrollbars-custom";

type DropdownItemProps = {
    icon?: FC;
    label: string;
    className?: string;
    onSelected?: () => void;
    onClick?: () => void;
};
const DropDownItem: React.FC<DropdownItemProps> = ({ icon, label, className, onSelected, onClick }) => {
    const Icon = icon ? icon : () => <i />
    return (<a className={classNames(styles.icon, className)} onClick={() => {
        onSelected && onSelected()
        onClick && onClick()
    }}><Icon /><span>{label}</span></a>)
}


export type DropdownProps = {
    trigger: any;
    title?: string;
    className?: string;
    onOpen?: (isOpen: boolean) => any;
}
export const Dropdown: React.FC<DropdownProps> & { Item: React.FC<DropdownItemProps>; }
    = ({ className, trigger, title, onOpen, children }) => {
        const [open, setOpen] = useState<boolean>(false)
        const ref = useRef(null);
        useOnClickOutside(ref, () => {
            setOpen(false)
        });

        useEffect(() => {
            onOpen && onOpen(open)
        }, [open])

        return (<div className={classNames(styles.dropdown)} ref={ref}>
            {
                cloneElement(trigger, {
                    onClick: () => setOpen(!open)
                })
            }
            <div className={classNames(styles.dropdownMenu, className, { [styles.show]: open })}>
                <Scrollbar
                    thumbYProps={{ className: styles.thumbY }}
                    trackYProps={{ className: styles.trackY }}
                    contentProps={{
                        style: {
                            padding: '8px',
                            paddingTop: '16px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            height: '100%',
                            alignContent: 'flex-start',
                            alignItems: 'flex-start'
                        }
                    }}>
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
                </Scrollbar>
            </div>
        </div>)
    }
Dropdown.Item = DropDownItem