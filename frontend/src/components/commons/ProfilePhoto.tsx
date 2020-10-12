import React from "react";
import {ImageFile} from "../../utils/utils";

type Props = {
    url?: string;
    preview?: ImageFile;
    className?: string
}
export const ProfilePhoto: React.FC<Props> = ({className, url, preview}) => {
    return (<img
            className={className}
            src={preview?.result || url || 'ic_person.png'}
            style={{objectFit: "cover"}}
            alt={'profile photo'}/>)
}