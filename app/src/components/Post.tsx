import React from "react";
import {Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {useTimeSincePublished} from "../hooks/updateRelativeTimeHook";

import {FontAwesome} from '@expo/vector-icons';

import Image from 'react-native-scalable-image';
import {COLOR_PRIMARY, COLOR_PRIMARY_LIGHT2} from "../constants/Colors";
import {InteractionItem} from "./InteractionItem";
import {useNavigation} from "@react-navigation/native";
import {ProfilePhoto} from "./ProfilePhoto";
import {UserObject} from "../modules/usersReducer";
import {MyAppState} from "../modules/rootReducer";
import {PostMetadata} from "../modules/Post/postsReducer";
import {dislikePost, likePost} from "../modules/Post/postsActions";

type Props = {
    postId: string;
    onProfilePressed: (user: UserObject) => any;
    style?: any;
};
export const Post: React.FC<Props> = ({postId, onProfilePressed, style}) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const {entities, metas} = useSelector((state: MyAppState) => state.entities.posts)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)

    const post = entities[postId]
    const postMeta: PostMetadata | undefined = metas[postId]
    const postAuthor = users[post.userId]

    const timeSincePublished = useTimeSincePublished(post.createdAt)

    const postImages: Array<string> = post.images.length !== 0 ? post.images.map(value => value.url) : post.previewImages?.map((value) => value.uri) || []

    return (<View style={{...styles.container, ...style}}>
        <TouchableOpacity style={styles.header} onPress={() => onProfilePressed(postAuthor)} activeOpacity={0.7}>
            <ProfilePhoto profilePhotoUrl={postAuthor.profilePhotoUrl} size={54}/>
            <View style={{marginLeft: 6}}>
                <Text style={styles.username}>{postAuthor.fullname}</Text>
                <Text style={styles.createdAt}>{timeSincePublished}</Text>
            </View>
        </TouchableOpacity>
        <View style={{...styles.content, opacity: postMeta?.isUploading ? 0.4 : 1}}>
            {post.text.trim().length !== 0 && <Text style={styles.text}>{post.text}</Text>}
            <FlatList data={postImages} renderItem={({item}) => {
                return <Image style={styles.imageItem} width={Dimensions.get('window').width - 32}
                              source={{uri: item}}/>
            }} keyExtractor={(item => item)}/>
        </View>
        <View style={styles.interactions}>
            <InteractionItem count={post.likesCount} onPress={() => {
                dispatch(likePost(post.id, post.likeStatus === 'like'))
            }}>
                <FontAwesome name="thumbs-up" size={24}
                             color={post.likeStatus === 'like' ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT2}/>
            </InteractionItem>
            <InteractionItem count={post.dislikesCount} onPress={() => {
                dispatch(dislikePost(post.id, post.likeStatus === 'dislike'))
            }}>
                <FontAwesome name="thumbs-down" size={24}
                             color={post.likeStatus === 'dislike' ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT2}/>
            </InteractionItem>
            <InteractionItem count={post.commentsCount} onPress={() => {
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
        borderRadius: 12,
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
        alignItems: 'center',
    },
    imageItem: {
        marginTop: 2,
        marginBottom: 2,
        // marginRight: 68,
    }
})