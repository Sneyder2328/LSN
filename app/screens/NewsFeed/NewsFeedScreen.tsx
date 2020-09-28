import * as React from 'react';
import {StyleSheet} from 'react-native';

import {Text, View} from '../../components/Themed';

export const NewsFeedScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>items down here</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
