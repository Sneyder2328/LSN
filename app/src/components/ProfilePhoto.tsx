import React from "react";
import {Avatar} from "react-native-paper";
import {ImageStyle} from "react-native";

type Props = {
    profilePhotoUrl?: string;
    size: number;
    style?: ImageStyle;
};
export const ProfilePhoto: React.FC<Props> = ({profilePhotoUrl, size, style}) => {
    return <Avatar.Image
        source={profilePhotoUrl ? {uri: profilePhotoUrl} : require('../assets/images/ic_person.png')}
        size={size} style={[{backgroundColor: '#fff'}, style]}/>;
}