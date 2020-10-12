import React from "react";
import {ImageFile} from "../../utils/utils";

type Props ={
    url: string;
    preview?: ImageFile;
    className?: string;
}
export const CoverPhoto: React.FC<Props> = ({url,preview, className}) => {
    return url.length !== 0 ? (<img className={className} src={preview?.result || url}/>)
        : <div className={className} style={{
            backgroundColor: '#469efa'
        }}/>;
}