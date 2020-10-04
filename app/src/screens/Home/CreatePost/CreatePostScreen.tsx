import React, {useEffect, useState} from "react";
import {Alert, FlatList, Image, Platform, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {ProfilePic} from "../../../components/ProfilePic";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../../../reducers/rootReducer";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome5} from '@expo/vector-icons';
import {PostButton} from "../../../components/PostButton";
import {createPost} from "../../../actions/postsActions";
import {genUUID, ImageFile} from "../../../utils/utils";
import * as ImagePicker from 'expo-image-picker';
import {COLOR_PRIMARY} from "../../../constants/Colors";

const optionsForImage = {
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7
};

const avatarDimens = 50;

const getImgTypeForUri = (uri: string): string | undefined => {
    if (uri.indexOf(".png")) return 'image/png'
    if (uri.indexOf(".jpg") || uri.indexOf(".jpeg")) return 'image/jpeg'
}

export const CreatePostScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    // const {isCreatingPost} = useSelector((state: MyAppState) => state.entities.newsFeed)
    const userId: string = useSelector((state: MyAppState) => state.auth.userId!!)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)
    const currentUser = users[userId!!]
    const [imageFiles, setImageFiles] = useState<Array<ImageFile>>([]);
    const [text, setText] = useState("")

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (<PostButton onPress={() => {
                console.log('post', imageFiles)
                dispatch(createPost({id: genUUID(), imageFiles, text, userId}))
                navigation.goBack()
            }}/>)
        })
        // navigation.setParams({text, userId})
    }, [text, userId, imageFiles])

    const askPermissionForCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera is required!");
        }
        return permissionResult.granted
    }

    const askPermissionForCameraRoll = async () => {
        const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
        }
        return permissionResult.granted
    }

    const openImagePickerAsync = async () => {
        if (!(await askPermissionForCameraRoll())) return
        const pickerResult = await ImagePicker.launchImageLibraryAsync(optionsForImage);
        processImageForPost(pickerResult)
    }

    const launchCameraAsync = async () => {
        if (!(await askPermissionForCamera())) return
        if (!(await askPermissionForCameraRoll())) return
        const pickerResult = await ImagePicker.launchCameraAsync(optionsForImage);
        processImageForPost(pickerResult)
    }

    const processImageForPost = (pickerResult: ImagePicker.ImagePickerResult) => {
        console.log('pickerResult=', pickerResult);
        if (!pickerResult.cancelled && pickerResult.uri) {
            const type = getImgTypeForUri(pickerResult.uri);
            if (!type) {
                alert("This type of file is not supported")
                return
            }
            const newImg: ImageFile = {
                uri: Platform.OS === "android" ? pickerResult.uri : pickerResult.uri.replace("file://", ""),
                name: new Date().getTime().toString(),
                type
            }
            setImageFiles([...imageFiles, newImg])
        }
    }
    return (<View style={styles.container}>
        <View style={styles.header}>
            <ProfilePic user={currentUser} size={avatarDimens}/>
            <TextInput placeholder={"What's happening?"} style={styles.input} autoFocus={true}
                       multiline={true} onChangeText={setText} value={text}/>
        </View>
        <View style={styles.bottom}>
            <FlatList
                style={{
                    // backgroundColor: '#00f',
                    // bottom: 0,
                    // left: 0,
                }}
                data={imageFiles} renderItem={({item}) => (<PreviewImage uri={item.uri}/>)}
                keyExtractor={(item => item.name)} horizontal={true}/>
            <View style={styles.imgSelectors}>
                <TouchableOpacity onPress={openImagePickerAsync}>
                    <FontAwesome5 name="images" size={32} color={COLOR_PRIMARY} style={styles.imagePicker}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={launchCameraAsync}>
                    <FontAwesome5 name="camera" size={32} color={COLOR_PRIMARY} style={styles.imagePicker}/>
                </TouchableOpacity>
            </View>
        </View>
        {/*<FullOverlay isVisible={isCreatingPost}/>*/}
    </View>)
}

const PreviewImage: React.FC<{ uri: string }> = ({uri}) => {
    console.log('PreviewImage', uri);
    const imgDimens = 150;

    return (<View>
        <Image source={{uri}} width={imgDimens} height={imgDimens}
               style={{
                   // backgroundColor: '#00f',
                   width: imgDimens,
                   height: imgDimens,
                   marginLeft: 8,
                   borderRadius: 12,
               }}/>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flex: 1,
        // justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        flex: 1,
        // backgroundColor: '#f00',
    },
    input: {
        marginLeft: 8,
        fontSize: 18,
        // backgroundColor: '#0f0',
        flex: 1,
        alignSelf: 'flex-start',
        minHeight: avatarDimens,
    },
    bottom: {
        // flex: 1,
        marginTop: 8,
        // position: 'relative',
        // position: 'absolute',
        // bottom: 8,
        // left: 4,
        // backgroundColor: '#0f0'
    },
    imgSelectors: {
        flexDirection: 'row',
        // backgroundColor: '#f00',
        alignItems: "center",
    },
    imagePicker: {
        marginLeft: 4,
        padding: 8,
        // backgroundColor: '#0f0',
    }
})