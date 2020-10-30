import React from "react";
import {ImageFile} from "../../utils/utils";
import styles from './styles.module.scss'
import classNames from "classnames";

export type ProfilePhotoProps = {
    url?: string;
    preview?: ImageFile;
    className?: string;
    size: 'large' | 'medium' | 'small1' | 'small2' | 'small3';
    border?: boolean;
}
// https://res.cloudinary.com/dkflrjxwe/image/upload/ar_1,c_crop/v1602532440/postImages/photo-1423592707957-3b212afa6733-1602532431280.jpg
const centerCrop = (url: string | undefined): string | undefined => {
    if (!url) return
    const indexOf = url.indexOf('res.cloudinary.com');
    if (indexOf === -1) return url
    const indexOf1 = url.indexOf('image/upload') + 13;
    return url.slice(0, indexOf1) + 'w_200,h_200,c_lfill/' + url.slice(indexOf1)
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = (
    {className = '', size, url, preview, border}
) => {
    return (<img
        className={classNames(styles.imageProfile, styles[size], className, {[styles.border]: border})}
        src={preview?.result || centerCrop(url) || 'ic_person.png'}
        alt={'profile photo'}/>)
}