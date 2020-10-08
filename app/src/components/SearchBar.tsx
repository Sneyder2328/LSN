import {StyleSheet, TextInput, TextStyle, View} from "react-native"
import React, {useState} from "react";


type Props = {
    style?: TextStyle
}
export const SearchBar: React.FC<Props> = ({style}) => {
    const [search, setSearch] = useState("")

    return (<View style={{flex: 1,}}>
        <TextInput value={search} onChangeText={setSearch}
                   placeholder="Search..." placeholderTextColor={'#dbdbdb'}
                   style={[styles.input, style]}/>
    </View>)
}

const styles = StyleSheet.create({
    input: {
        borderColor: 'rgba(35,150,215,0)',
        borderWidth: 1,
        borderRadius: 22,
        padding: 8,
        paddingLeft: 12,
        paddingRight: 12,
        color: '#fff',
        fontSize: 17,
        // backgroundColor: '#1390e8',
        backgroundColor: 'rgba(0,0,0,0.09)',
    }
})