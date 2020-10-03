import React from "react";
import {Dimensions, FlatList, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../reducers/rootReducer";
import {useTimeSincePublished} from "../hooks/updateRelativeTimeHook";

import {AntDesign} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';

import Image from 'react-native-scalable-image';
import {COLOR_PRIMARY, COLOR_PRIMARY_LIGHT2} from "../constants/Colors";
import {Avatar} from "react-native-paper";
import {InteractionItem} from "./InteractionItem";
import {dislikePost, likePost} from "../actions/postsActions";
import {useNavigation} from "@react-navigation/native";

export const Post: React.FC<{ postId: string }> = ({postId}) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const {entities, metas} = useSelector((state: MyAppState) => state.entities.posts)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)

    const post = entities[postId]
    const postAuthor = users[post.userId]

    const timeSincePublished = useTimeSincePublished(post.createdAt)

    return (<View style={styles.container}>
        <View style={styles.header}>
            <Avatar.Image
                source={postAuthor?.profilePhotoUrl ? {uri: postAuthor.profilePhotoUrl} : require('../assets/images/ic_person.png')}
                size={54} style={styles.authorAvatar}/>
            <View style={{marginLeft: 4}}>
                <Text style={styles.username}>{postAuthor.fullname}</Text>
                <Text style={styles.createdAt}>{timeSincePublished}</Text>
            </View>
        </View>
        <View style={styles.content}>
            <Text style={styles.text}>{post.text}</Text>
            <FlatList data={post.images} renderItem={({item}) => {
                return <Image style={styles.imageItem} width={Dimensions.get('window').width} source={{uri: item.url}}/>
            }} keyExtractor={(item => item.url)}/>
        </View>
        <View style={styles.interactions}>
            <InteractionItem count={post.likesCount} onPress={() => {
                dispatch(likePost(post.id, post.likeStatus === 'like'))
            }}>
                <AntDesign name="like1" size={24}
                           color={post.likeStatus === 'like' ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT2}/>
            </InteractionItem>
            <InteractionItem count={post.dislikesCount} onPress={() => {
                dispatch(dislikePost(post.id, post.likeStatus === 'dislike'))
            }}>
                <AntDesign name="dislike1" size={24}
                           color={post.likeStatus === 'dislike' ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT2}/>
            </InteractionItem>
            <InteractionItem count={post.commentsCount} onPress={() => {
                console.log('comment clicked!')
                navigation.navigate('PostDetail', {postId})
            }}>
                <FontAwesome name="comment" size={24} color={COLOR_PRIMARY_LIGHT2}/>
            </InteractionItem>
            <InteractionItem count={0} onPress={() => console.log('share clicked!')}>
                <FontAwesome name="share" size={24} color={COLOR_PRIMARY_LIGHT2}/>
            </InteractionItem>
        </View>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        marginBottom: 4,
        // width: '100%'
    },
    header: {
        flexDirection: 'row',
    },
    content: {},
    authorAvatar: {},
    username: {
        fontWeight: 'bold',
    },
    createdAt: {
        color: "#9992a0"
    },
    text: {},
    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    imageItem: {
        marginTop: 2,
        marginBottom: 2
    }
})