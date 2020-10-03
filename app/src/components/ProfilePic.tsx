import React from "react";
import {UserObject} from "../reducers/usersReducer";
import {Avatar} from "react-native-paper";

export const ProfilePic: React.FC<{user: UserObject; size: number; styles?: any}> = ({user, size, styles}) =>{
    return <Avatar.Image
        source={user?.profilePhotoUrl ? {uri: user.profilePhotoUrl} : require('../assets/images/ic_person.png')}
        size={size} style={styles}/>;
}