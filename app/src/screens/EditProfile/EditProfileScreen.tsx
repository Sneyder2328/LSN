import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {ProfilePhoto} from "../../components/ProfilePhoto";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../../modules/rootReducer";
import {COLOR_PRIMARY, COLOR_TEXT_CAPTION, FORM_FONT_SIZE} from "../../constants/Colors";
import {CoverPhoto} from "../../components/CoverPhoto";
import {TextInput} from "react-native-paper";
import {HeaderActionButton} from "../../components/HeaderActionButton";
import {useNavigation} from "@react-navigation/native";
import {updateProfile} from "../../modules/Auth/authActions";
import {FullOverlay} from "../../components/FullOverlay";

export const EditProfileScreenName = "EditProfile"
export const EditProfileScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const userId: string = useSelector((state: MyAppState) => state.auth.userId)!!
    const userProfile = useSelector((state: MyAppState) => state.entities.users.entities)[userId]
    const isUpdatingProfile: boolean = useSelector((state: MyAppState) => state.auth.isUpdatingProfile) || false

    const [username, setUsername] = useState<string>(userProfile.username)
    const [fullname, setFullname] = useState<string>(userProfile.fullname)
    const [description, setDescription] = useState<string>(userProfile.description)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<HeaderActionButton title={'SAVE'} onPress={async () => {
                const updated = await dispatch(updateProfile(userId, fullname, username, description, '', ''))
                console.log('updated=', updated);
                // @ts-ignore
                if (updated === true) {
                    console.log('going bak!!!');
                    navigation.goBack()
                }
            }}/>)
        })
    }, [fullname, username, description])

    return (<View>
        <CoverPhoto coverPhotoUrl={userProfile.coverPhotoUrl}/>
        <ProfilePhoto profilePhotoUrl={userProfile.profilePhotoUrl} size={84}
                      styles={{marginTop: -36, marginLeft: 16}}/>
        <TextInput style={styles.input} mode='outlined' label="Full name" placeholder={'Full name'} autoCorrect={false}
                   value={fullname} onChangeText={setFullname} returnKeyType={'next'} autoCapitalize={'words'}/>
        <TextInput style={styles.input} mode='outlined' label="Username" placeholder={'Username'} autoCorrect={false}
                   value={username} onChangeText={setUsername} returnKeyType={'next'} autoCapitalize={'none'}
                   autoCompleteType={'username'}/>
        <TextInput style={styles.input} mode='outlined' label="Description" placeholder={'Description'}
                   autoCorrect={false}
                   value={description} onChangeText={setDescription} returnKeyType={'done'}/>
        <FullOverlay isVisible={isUpdatingProfile}/>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3f3ff'
    },
    username: {
        fontSize: 15,
        color: COLOR_TEXT_CAPTION
    },
    fullname: {
        fontSize: 18,
    },
    description: {
        fontSize: 16
    },
    coverPhoto: {
        backgroundColor: COLOR_PRIMARY
    },
    input: {
        marginRight: 16,
        marginLeft: 16,
        marginTop: 16,
        fontSize: FORM_FONT_SIZE,
    },
})