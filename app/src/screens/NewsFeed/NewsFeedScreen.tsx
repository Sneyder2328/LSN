import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {loadPosts} from "../../actions/postsActions";
import {MyAppState} from "../../reducers/rootReducer";
import {Post} from "../../components/Post";
import { useNavigation } from '@react-navigation/native';

export const NewsFeedScreen = () => {
    const {postIds, isLoadingPosts} = useSelector((state: MyAppState) => state.entities.newsFeed.latest)
    const dispatch = useDispatch()
    const navigation = useNavigation();

    useEffect(() => {
        console.log('fetching posts!!');
        dispatch(loadPosts());
    }, []);

    useEffect(() => {
        console.log('isLoadingPosts=', isLoadingPosts);
    }, [])

    return (
        <View style={styles.container}>
            <FlatList style={styles.postsList} data={postIds} renderItem={({item}) => (<Post postId={item}/>)}
                      keyExtractor={item => item} refreshing={isLoadingPosts} onRefresh={() => {
                console.log("onRefresh");
                dispatch(loadPosts());
            }}/>
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate("CreatePost")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f3ff'
    },
    postsList: {
        flex: 1,
        margin: 8
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
