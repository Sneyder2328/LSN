import React from "react";
import {ImageFile} from "../../utils/utils";

type Props = {
    url?: string;
    preview?: ImageFile;
    className?: string
}
const centerCrop = (url: string | undefined): string | undefined => {
    if (!url) return
    const indexOf = url.indexOf('res.cloudinary.com');
    if (indexOf === -1) return url
    const indexOf1 = url.indexOf('image/upload') + 13;
    return url.slice(0, indexOf1) + 'w_200,h_200,c_lfill/' + url.slice(indexOf1)
}

export const ProfilePhoto: React.FC<Props> = ({className, url, preview}) => {
    return (<img
        className={className}
        src={preview?.result || centerCrop(url) || 'ic_person.png'}
        style={{objectFit: "cover"}}
        alt={'profile photo'}/>)
}