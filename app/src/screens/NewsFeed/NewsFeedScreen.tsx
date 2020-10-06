import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper'
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {Post} from "../../components/Post";
import {useNavigation} from '@react-navigation/native';
import {loadPosts} from "../../modules/Post/postsActions";
import {UserObject} from "../../modules/usersReducer";
import {MyAppState} from "../../modules/rootReducer";

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

    const handleProfilePressed = (user: UserObject) => {
        console.log('handleProfilePressed', user, navigation);
        navigation.navigate("UserProfile", {user})
        // navigation.navigate("UserProfile")
    }
    return (
        <View style={styles.container}>
            <FlatList style={styles.postsList} data={postIds}
                      renderItem={({item}) => (<Post postId={item} onProfilePressed={handleProfilePressed}/>)}
                      keyExtractor={item => item} refreshing={isLoadingPosts} onRefresh={() => {
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
        margin: 8,
        marginBottom: 0,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
