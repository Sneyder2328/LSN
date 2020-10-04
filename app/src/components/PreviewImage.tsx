import React from "react";
import {Image, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {FontAwesome} from '@expo/vector-icons';

type Props = {
    uri: string;
    onImageRemoved: (uri: string) => any;
};
export const PreviewImage: React.FC<Props> = ({uri, onImageRemoved}) => {
    console.log('PreviewImage', uri);
    const windowWidth = useWindowDimensions().width;
    const imgDimens = windowWidth / 2.5;

    return (<View>
        <TouchableOpacity style={{
            position: "absolute",
            top: 4,
            right: 8,
            zIndex: 100,
            backgroundColor: "#004a65",
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
        }} onPress={() => onImageRemoved(uri)}>
            <FontAwesome name="remove" size={22} color="#fff"/>
        </TouchableOpacity>
        <Image source={{uri}} width={imgDimens} height={imgDimens}
               style={{
                   // backgroundColor: '#00f',
                   width: imgDimens,
                   height: imgDimens,
                   marginLeft: 4,
                   marginRight: 4,
                   borderRadius: 12,
               }}/>
    </View>)
}