import React, {useEffect, useState} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {ProfilePic} from "../../../components/ProfilePic";
import {useSelector} from "react-redux";
import {MyAppState} from "../../../reducers/rootReducer";
import {useNavigation} from "@react-navigation/native";
import {FullOverlay} from "../../../components/FullOverlay";

export const CreatePostScreen = () => {
    const navigation = useNavigation()
    const {isCreatingPost} = useSelector((state: MyAppState) => state.entities.newsFeed)
    const {userId} = useSelector((state: MyAppState) => state.auth)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)
    const currentUser = users[userId!!]
    const [text, setText] = useState("")

    useEffect(() => {
        navigation.setParams({text, userId})
    }, [text, userId])

    return (<View style={styles.container}>
        <ProfilePic user={currentUser} size={50}/>
        <TextInput placeholder={"What's happening?"} style={styles.input} autoFocus={true}
                   multiline={true} onChangeText={setText} value={text}/>
        <FullOverlay isVisible={isCreatingPost}/>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8
    },
    input: {
        marginLeft: 8,
        fontSize: 18,
        flex: 1
    }
})