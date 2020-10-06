import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {useRoute} from '@react-navigation/native';
import {ProfilePic} from "../../components/ProfilePic";
import {COLOR_PRIMARY, COLOR_TEXT_CAPTION} from "../../constants/Colors";
import {useDispatch} from "react-redux";
import {fetchProfile} from "../../modules/Profile/profilesActions";
import {UserObject} from "../../modules/usersReducer";

const aspectRatio = 2.8;

export const ProfileScreen = () => {
    const width = useWindowDimensions().width
    const route = useRoute()
    const dispatch = useDispatch()


    // @ts-ignore
    const userProfile: UserObject = route.params.user
    console.log('userProfile', userProfile);

    useEffect(()=>{
        console.log('useEffect userProfile', userProfile);
        dispatch(fetchProfile(userProfile.username, true))
    }, [userProfile])

    const coverPicSource = userProfile.coverPhotoUrl.length !== 0 ? {uri: userProfile.coverPhotoUrl} : {}
    const profilePicSource = userProfile.profilePhotoUrl.length !== 0 ? {uri: userProfile.coverPhotoUrl} : {}

    return (<View>
        <Image source={coverPicSource} width={width} height={width / aspectRatio} style={{backgroundColor: COLOR_PRIMARY}}/>
        <ProfilePic user={userProfile} size={84} styles={{marginTop: -36, marginLeft: 16}}/>
        <View style={{marginLeft: 16, marginTop: 4}}>
            <Text style={styles.fullname}>
                {userProfile.fullname}
            </Text>
            <Text style={styles.username}>
                @{userProfile.username}
            </Text>
            <Text style={styles.description}>
                {userProfile.description}
            </Text>
        </View>
    </View>)
}
const styles = StyleSheet.create({
    username: {
        fontSize: 15,
        color: COLOR_TEXT_CAPTION
    },
    fullname: {
        fontSize: 18,
    },
    description: {
        fontSize: 16
    }
})