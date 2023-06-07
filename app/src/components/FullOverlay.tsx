import React from "react";
import {StyleSheet, View} from "react-native";
import { useWindowDimensions } from 'react-native';

type Props = {
    isVisible: boolean;
}

export const FullOverlay: React.FC<Props> = ({isVisible}) => {
    if (!isVisible) return null
    return <View style={
        {...styles.overlay,
            width: useWindowDimensions().width,
            height: useWindowDimensions().height,
        }}/>
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0,4,7,0.26)",
        zIndex: 5
    },
})