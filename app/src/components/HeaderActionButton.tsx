import {Text, TouchableHighlight} from "react-native";
import React from "react";

type Props = {
    title: string;
    onPress: () => any;
}
export const HeaderActionButton: React.FC<Props> = ({title, onPress}) => {
    return (<TouchableHighlight
        underlayColor={"#43bcfa"}
        onPress={onPress}
        style={{
            flex: 1,
            padding: 16,
            justifyContent: 'center',
        }}>
        <Text style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 19,
        }}>{title}</Text>
    </TouchableHighlight>)
}