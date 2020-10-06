import React from "react";
import {Text, TouchableHighlight, View} from "react-native";
import {COLOR_PRIMARY, COLOR_PRIMARY_LIGHT2} from "../constants/Colors";

type Props = { count: number; onPress: () => any; style?: any };
export const InteractionItem: React.FC<Props> = ({count, onPress, style, children}) => {
    return (<TouchableHighlight style={{...style, backgroundColor: '#fff'}} onPress={onPress} underlayColor={COLOR_PRIMARY} activeOpacity={0.8}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {children}
            {count !== 0 && <Text style={{color: COLOR_PRIMARY_LIGHT2, marginLeft: 4, fontSize: 17}}>{count}</Text>}
        </View>
    </TouchableHighlight>)
}