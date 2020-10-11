import {Image, ImageStyle, StyleSheet, useWindowDimensions} from "react-native";
import React from "react";
import {COLOR_PRIMARY} from "../constants/Colors";

type Props = {
    coverPhotoUrl? : string;
    style?: ImageStyle;
}
const coverPhotoAspectRatio = 2.8;
export const CoverPhoto: React.FC<Props> = ({coverPhotoUrl, style}) => {
    const width = useWindowDimensions().width

    const coverPicSource = coverPhotoUrl?.length !== 0 ? {uri: coverPhotoUrl} : {}

    return (
        <Image source={coverPicSource}
               width={width}
               height={width / coverPhotoAspectRatio}
               style={[styles.coverPhoto, style]}/>
    )
}
const styles = StyleSheet.create({
    coverPhoto: {
        backgroundColor: COLOR_PRIMARY
    }
})