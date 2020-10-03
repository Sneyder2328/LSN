import {Text, TouchableHighlight} from "react-native";
import React from "react";

type Props = {
    onPress: () => any;
}
export const PostButton: React.FC<Props> = ({onPress}) => {
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
        }}>POST</Text>
    </TouchableHighlight>)
}