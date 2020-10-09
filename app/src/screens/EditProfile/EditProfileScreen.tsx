import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
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
import {FieldErrors, useForm} from "react-hook-form";

type EditProfileParams = {
    username: string;
    fullname: string;
    description: string;
};

export const EditProfileScreenName = "EditProfile"
export const EditProfileScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const userId: string = useSelector((state: MyAppState) => state.auth.userId)!!
    const userProfile = useSelector((state: MyAppState) => state.entities.users.entities)[userId]
    const isUpdatingProfile: boolean = useSelector((state: MyAppState) => state.auth.isUpdatingProfile) || false
    const updateProfileError: string | undefined = useSelector((state: MyAppState) => state.auth.updateProfileError)

    const {register, handleSubmit, setValue} = useForm<EditProfileParams>()

    useEffect(() => {
        if (updateProfileError) {
            Alert.alert('There was an error updating the profile', updateProfileError)
        }
    }, [updateProfileError])

    const [username, setUsername] = useState<string>(userProfile.username)
    const [fullname, setFullname] = useState<string>(userProfile.fullname)
    const [description, setDescription] = useState<string>(userProfile.description)

    useEffect(() => {
        register("fullname", {
            required: {value: true, message: 'Please enter your full name'},
            minLength: {value: 5, message: 'This field needs to be at least 5 characters long'}
        })
        register('username', {
            required: {value: true, message: 'Please enter a username'},
            pattern: {value: /^\w+$/, message: 'Username must contain only alphanumeric values'},
            minLength: {value: 5, message: 'Username must be at least 5 characters long'}
        })
        register('description', {
            maxLength: {value: 500, message: 'Description must be at most 500 characters long'}
        })
    }, [register])

    useEffect(() => {
        setValue("username", username)
        setValue("fullname", fullname)
        setValue("description", description)
    }, [username, fullname, description])

    const handleSave = async ({fullname, username, description}: EditProfileParams) => {
        const updated = await dispatch(updateProfile(userId, fullname, username, description, '', ''))
        console.log('updated=', updated);
        // @ts-ignore
        if (updated === true) {
            console.log('going bak!!!');
            navigation.goBack()
        }
    };

    const onValidData = async (data: EditProfileParams) => {
        console.log('onValidData', data);
        if (!isUpdatingProfile) {
            await handleSave(data)
        }
    }
    const onInvalidData = (errors: FieldErrors) => {
        console.log('onInvalidData', errors);
        if (!isUpdatingProfile) {
            alert(Object.values(errors)[0].message)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<HeaderActionButton title={'SAVE'} onPress={handleSubmit(onValidData, onInvalidData)}/>)
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