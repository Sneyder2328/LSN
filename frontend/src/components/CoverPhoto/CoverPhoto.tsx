import React from "react";
import {ImageFile} from "../../utils/utils";
import styles from './styles.module.scss'

type Props ={
    url?: string;
    preview?: ImageFile;
    className?: string;
}
export const CoverPhoto: React.FC<Props> = ({url,preview, className}) => {
    return url?.length !== 0 ? (<img className={className} src={preview?.result || url}/>)
        : <div className={[className, styles.coverPhoto].join(' ')} style={{
            backgroundColor: '#469efa'
        }}/>;
}