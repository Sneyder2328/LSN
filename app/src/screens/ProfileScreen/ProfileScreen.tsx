import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from "react-native";
import {useNavigation, useRoute} from '@react-navigation/native';
import {ProfilePhoto} from "../../components/ProfilePhoto";
import {COLOR_ACCENT, COLOR_PRIMARY, COLOR_TEXT_CAPTION} from "../../constants/Colors";
import {useDispatch, useSelector} from "react-redux";
import {fetchProfile} from "../../modules/Profile/profilesActions";
import {UserObject} from "../../modules/usersReducer";
import {Post} from "../../components/Post";
import {MyAppState} from "../../modules/rootReducer";
import {CoverPhoto} from "../../components/CoverPhoto";
import {Button} from "react-native-paper";
import {EditProfileScreenName} from "../EditProfile/EditProfileScreen";


export const ProfileScreen = () => {
    const route = useRoute()
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const currentUserId = useSelector((state: MyAppState) => state.auth.userId)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)
    // @ts-ignore
    const userProfile: UserObject = route?.params?.user ? route.params.user : users[currentUserId]
    console.log('userProfile', userProfile);


    useEffect(() => {
        console.log('useEffect userProfile', userProfile);
        dispatch(fetchProfile(userProfile.username, true))
    }, [dispatch])

    const postsByProfile = useSelector((state: MyAppState) => state.profiles)
    const [postsIds, setPostsIds] = useState<Array<string>>([])

    useEffect(() => {
        const postsIdsLoaded = postsByProfile[userProfile.userId]?.postsIds;
        if (postsIdsLoaded) {
            console.log('setPostsIds', postsIdsLoaded);
            setPostsIds(postsIdsLoaded)
        }
    }, [postsByProfile])

    const handleProfilePressed = (user: UserObject) => navigation.navigate("UserProfile", {user})

    const HeaderComponents = <>
        <CoverPhoto coverPhotoUrl={userProfile.coverPhotoUrl}/>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 12,
            marginRight: 12,
        }}>
            <ProfilePhoto profilePhotoUrl={userProfile.profilePhotoUrl} size={86} styles={{marginTop: -36}}/>
            {currentUserId === userProfile.userId &&
            <Button mode="contained" onPress={() => navigation.navigate(EditProfileScreenName)} color={COLOR_ACCENT}
                    style={{
                        alignSelf: 'flex-end',
                    }}>Edit profile</Button>}
        </View>
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
        </View></>;
    return (<View style={styles.container}>
        <FlatList style={styles.postsList} data={postsIds}
                  renderItem={({item}) => (<Post
                      postId={item}
                      onProfilePressed={handleProfilePressed}
                      style={{margin: 8}}/>)}
                  keyExtractor={item => item} ListHeaderComponent={HeaderComponents}
                  ListHeaderComponentStyle={{padding: 0}}/>
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
    postsList: {
        // backgroundColor: '#0f0',
        // flex: 1,
        // padding: 8,
        marginBottom: 8,
    },
})