import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export const SearchScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search stuff in here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
