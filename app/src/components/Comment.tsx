import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {InteractionItem} from "./InteractionItem";
import {AntDesign} from "@expo/vector-icons";
import {COLOR_PRIMARY, COLOR_PRIMARY_LIGHT2} from "../constants/Colors";
import {useTimeSincePublished} from "../hooks/updateRelativeTimeHook";
import {ProfilePhoto} from "./ProfilePhoto";
import {MyAppState} from "../modules/rootReducer";
import {dislikeComment, likeComment} from "../modules/Comment/commentActions";

export const Comment: React.FC<{ commentId: string }> = ({commentId}) => {
    const dispatch = useDispatch()
    const comments = useSelector((state: MyAppState) => state.entities.comments.entities)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)
    const comment = comments[commentId]
    const commentAuthor = users[comment.userId]
    const timeSincePublished = useTimeSincePublished(comment.createdAt)

    console.log('Comment=', commentId, comment, commentAuthor);

    return <View style={styles.container}>
        <ProfilePhoto profilePhotoUrl={commentAuthor.profilePhotoUrl} size={48}/>
        <View style={{marginLeft: 6, marginTop: 2}}>
            <Text style={styles.username}>{commentAuthor.fullname}</Text>
            <Text>{comment.text}</Text>
            <View style={{flexDirection: 'row'}}>
                <InteractionItem count={comment.likesCount} onPress={() => {
                    dispatch(likeComment(comment.id, comment.likeStatus === 'like'))
                }}>
                    <AntDesign name="like1" size={24}
                               color={comment.likeStatus === 'like' ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT2}/>
                </InteractionItem>
                <InteractionItem count={comment.dislikesCount} style={{marginLeft: 8}} onPress={() => {
                    dispatch(dislikeComment(comment.id, comment.likeStatus === 'dislike'))
                }}>
                    <AntDesign name="dislike1" size={24}
                               color={comment.likeStatus === 'dislike' ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT2}/>
                </InteractionItem>
                <Text style={styles.createdAt}>{timeSincePublished}</Text>
            </View>
        </View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        marginBottom: 4,
        flexDirection: 'row'
    },
    header: {
        flexDirection: 'row',
    },
    content: {},
    username: {
        fontSize: 14,
    },
    createdAt: {
        color: "#9992a0",
        marginLeft: 8
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