import {Image, StyleSheet, useWindowDimensions} from "react-native";
import React from "react";
import {COLOR_PRIMARY} from "../constants/Colors";

type Props = {
    coverPhotoUrl? : string;
}
const coverPhotoAspectRatio = 2.8;
export const CoverPhoto: React.FC<Props> = ({coverPhotoUrl}) => {
    const width = useWindowDimensions().width

    const coverPicSource = coverPhotoUrl?.length !== 0 ? {uri: coverPhotoUrl} : {}

    return (
        <Image source={coverPicSource}
               width={width}
               height={width / coverPhotoAspectRatio}
               style={styles.coverPhoto}/>
    )
}
const styles = StyleSheet.create({
    coverPhoto: {
        backgroundColor: COLOR_PRIMARY
    }
})