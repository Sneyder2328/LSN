import React from "react";
import {Avatar} from "react-native-paper";

type Props = {
    profilePhotoUrl?: string;
    size: number;
    styles?: any
};
export const ProfilePhoto: React.FC<Props> = ({profilePhotoUrl, size, styles}) => {
    return <Avatar.Image
        source={profilePhotoUrl ? {uri: profilePhotoUrl} : require('../assets/images/ic_person.png')}
        size={size} style={{...styles, backgroundColor: '#fff'}}/>;
}