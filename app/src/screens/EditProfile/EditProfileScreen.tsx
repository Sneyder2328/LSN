import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {ProfilePhoto} from "../../components/ProfilePhoto";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../../modules/rootReducer";
import {COLOR_PRIMARY, COLOR_TEXT_CAPTION, FORM_FONT_SIZE} from "../../constants/Colors";
import {CoverPhoto} from "../../components/CoverPhoto";
import {TextInput, List} from "react-native-paper";
import {HeaderActionButton} from "../../components/HeaderActionButton";
import {useNavigation} from "@react-navigation/native";
import {updateProfile} from "../../modules/Auth/authActions";
import {FullOverlay} from "../../components/FullOverlay";
import {FieldErrors, useForm} from "react-hook-form";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Dialog, Portal} from 'react-native-paper';
import {
    getImgTypeForUri,
    getUri,
    ImageFile, launchCameraAsync, openImagePickerAsync
} from "../../utils/utils";
import * as ImagePicker from "expo-image-picker";
import {ImagePickerResult} from "expo-image-picker";

type EditProfileParams = {
    username: string;
    fullname: string;
    description: string;
};

export const EditProfileScreenName = "EditProfile"

type Prps = {
    visible: boolean;
    setVisibility: (visible: boolean) => void;
    onHandlePickerResult: (pickerResult: ImagePickerResult) => void;
    // processImageForProfile: (pickerResult: ImagePickerResult;
}
const PhotoPickerDialog: React.FC<Prps> = ({visible, setVisibility, onHandlePickerResult}) => {
    // const [visible, setVisible] = useState(false)
    const hideDialog = () => setVisibility(false)

    return (<Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
                <List.Item title="Take photo" onPress={async () => {
                    hideDialog()
                    await launchCameraAsync(onHandlePickerResult)
                }}/>
                <List.Item title="Choose existing photo" onPress={async () => {
                    hideDialog()
                    await openImagePickerAsync(onHandlePickerResult)
                }}/>
            </Dialog.Content>
        </Dialog>
    </Portal>)
}

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
    const [profilePhoto, setProfilePhoto] = useState<ImageFile>();
    const [isPickingProfilePic, setIsPickingProfilePic] = useState<boolean | undefined>(undefined);
    const [coverPhoto, setCoverPhoto] = useState<ImageFile>();

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
        // @ts-ignore
        const updated: boolean = await dispatch(
            updateProfile({userId, fullname, username, description, profilePhoto, coverPhoto})
        )
        if (updated) navigation.goBack()
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
    }, [fullname, username, description, profilePhoto, coverPhoto])

    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);

    const onChangeProfilePic = () => {
        setIsPickingProfilePic(true)
        showDialog()
    }
    const onChangeCoverPic = () => {
        setIsPickingProfilePic(false)
        showDialog()
    }

    const processImage = (pickerResult: ImagePicker.ImagePickerResult) => {
        console.log('pickerResult=', pickerResult);
        if (!pickerResult.cancelled && pickerResult.uri) {
            const type = getImgTypeForUri(pickerResult.uri);
            if (!type) return alert("This type of file is not supported")
            const newImg: ImageFile = {
                uri: getUri(pickerResult.uri),
                name: new Date().getTime().toString(),
                type
            }
            if (isPickingProfilePic) {
                setProfilePhoto(newImg)
            } else {
                setCoverPhoto(newImg)
            }
            setIsPickingProfilePic(undefined)
        }
    }

    return (<View style={{}}>
            {/*<CoverPhoto coverPhotoUrl={coverPhoto?.uri || userProfile.coverPhotoUrl}/>*/}
            <View style={styles.coverPhotoContainer}>
                {/*<CoverPhoto coverPhotoUrl={coverPhoto?.uri || userProfile.coverPhotoUrl}/>*/}
                <CoverPhoto coverPhotoUrl={coverPhoto?.uri || userProfile.coverPhotoUrl}/>
                <MaterialCommunityIcons name="camera-outline" size={36} color={'#fff'}
                                        style={{position: 'absolute'}} onPress={onChangeCoverPic}/>
            </View>
            <View style={styles.profilePhotoContainer}>
                <ProfilePhoto profilePhotoUrl={profilePhoto?.uri || userProfile.profilePhotoUrl} size={84}/>
                <MaterialCommunityIcons name="camera-outline" size={30} color={COLOR_PRIMARY}
                                        style={{position: 'absolute'}} onPress={onChangeProfilePic}/>
            </View>
            <TextInput style={styles.input} mode='outlined' label="Full name" placeholder={'Full name'}
                       autoCorrect={false}
                       value={fullname} onChangeText={setFullname} returnKeyType={'next'} autoCapitalize={'words'}/>
            <TextInput style={styles.input} mode='outlined' label="Username" placeholder={'Username'}
                       autoCorrect={false}
                       value={username} onChangeText={setUsername} returnKeyType={'next'} autoCapitalize={'none'}
                       autoCompleteType={'username'}/>
            <TextInput style={styles.input} mode='outlined' label="Description" placeholder={'Description'}
                       autoCorrect={false}
                       value={description} onChangeText={setDescription} returnKeyType={'done'}/>
            <PhotoPickerDialog visible={visible} setVisibility={(visibility) => setVisible(visibility)}
                               onHandlePickerResult={processImage}/>
            <FullOverlay isVisible={isUpdatingProfile}/>
        </View>
    )
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
    profilePhotoContainer: {
        marginTop: -36,
        marginLeft: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: 84,
    },
    coverPhotoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // flex: 1,
    }
})