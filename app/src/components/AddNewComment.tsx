import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {genUUID} from "../utils/utils";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {COLOR_PRIMARY, COLOR_PRIMARY_LIGHT2} from "../constants/Colors";
import {ProfilePic} from "./ProfilePic";
import {UserObject} from "../modules/usersReducer";
import {PostObject} from "../modules/Post/postsReducer";
import {CommentRequest} from "../modules/Comment/commentApi";
import {createComment} from "../modules/Comment/commentActions";


export const AddNewComment: React.FC<{ currentUser: UserObject; post: PostObject; inputRef: any }> = ({currentUser, post, inputRef}) => {
    const dispatch = useDispatch()
    const [text, setText] = useState("")

    const isTextEmpty = () => text.trim().length === 0;

    const onSubmitComment = () => {
        if (!isTextEmpty()) {
            console.log('sending comment', text);
            const newComment: CommentRequest = {
                id: genUUID(),
                img: '',
                text,
                postId: post.id,
                type: 'text'
            };
            dispatch(createComment(newComment))
            setText("")
        }
    }

    return <View style={styles.container}>
        <ProfilePic user={currentUser} size={48}/>
        <View style={styles.commentBox}>
            <TextInput style={styles.inputComment} placeholder={'Write a comment...'} multiline={true}
                       onChangeText={setText} value={text} ref={inputRef}/>
            <TouchableOpacity onPress={onSubmitComment} disabled={isTextEmpty()} style={styles.sendComment}>
                <MaterialIcons name="send" size={24} color={COLOR_PRIMARY} />
            </TouchableOpacity>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingBottom: 0,
        marginBottom: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 4,
        paddingRight: 4,
        paddingLeft: 4,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: COLOR_PRIMARY_LIGHT2,
    },
    commentBox: {
        flexDirection: 'row',
        flex: 1,
        borderColor: COLOR_PRIMARY,
        borderWidth: 1,
        borderRadius: 20,
        marginLeft: 6,
    },
    inputComment: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 2,
        paddingTop: 4,
        paddingBottom: 4,
    },
    sendComment: {
        alignSelf: 'center',
        marginRight: 8,
    }
})