import * as React from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {useSelector} from "react-redux";
import {MyAppState} from "../../modules/rootReducer";
import {UserSearch} from "../../modules/Search/searchReducer";
import {SearchResult} from "../../components/SearchResult";
import {COLOR_PRIMARY_LIGHT2} from "../../constants/Colors";

export const SearchScreen = () => {
    const {query, isSearching, queries, users} = useSelector((state: MyAppState) => state.search)

    if (isSearching) {
        console.log('animating', query);
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={COLOR_PRIMARY_LIGHT2} animating={true}/>
            </View>)
    }
    if (!query || !queries || !users) return null
    const people: Array<UserSearch> = queries[query] ? queries[query].map((userId) => users[userId]) : []

    return (
        <View style={styles.container}>
            <FlatList data={people} keyExtractor={(item => item.userId)} style={styles.list}
                      renderItem={({item}) => (<SearchResult user={item}/>)}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    list: {
        margin: 12,
    }
});
