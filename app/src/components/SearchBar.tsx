import {StyleSheet, TextInput, TextStyle, View} from "react-native"
import React, {useEffect, useRef, useState} from "react";
import {searchUser} from "../modules/Search/searchActions";
import {useDispatch} from "react-redux";
import {Appbar} from "react-native-paper";


type Props = {
    style?: TextStyle
}
export const SearchBar: React.FC<Props> = ({style}) => {
    const [query, setQuery] = useState<string>("");
    const dispatch = useDispatch()
    const inputRef = useRef<TextInput>(null)

    useEffect(() => {
        console.log('query changed', query);
        dispatch(searchUser(query));
    }, [query]);

    return (<View style={styles.container}>
        <Appbar.Action icon="magnify" color={"#fff"} style={{
            marginLeft: 8,
        }} onPress={() => {
            inputRef?.current?.focus()
        }} />
        <TextInput ref={inputRef} value={query} onChangeText={setQuery}
                   placeholder="Search..." placeholderTextColor={'#dbdbdb'}
                   style={[styles.input, style]}/>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderColor: 'rgba(35,150,215,0)',
        borderWidth: 1,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.09)',
        marginLeft: 8,
    },
    input: {
        flex: 1,
        padding: 6,
        paddingLeft: 0,
        color: '#fff',
        fontSize: 17,
    }
})