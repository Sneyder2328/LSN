import {v4 as uuidv4} from 'uuid';
import * as ImagePicker from "expo-image-picker";
import {Platform} from "react-native";

type HasDate = {
    createdAt: string;
};

export interface HashTable<T> {
    [key: string]: T;
}

export interface HashTableArray<T> {
    [key: string]: Array<T>;
}

export interface NumberedHashTable<T> {
    [key: number]: T;
}

export const compareByDateDesc = (one: HasDate, two: HasDate): number => new Date(one.createdAt).getTime() - new Date(two.createdAt).getTime();
export const compareByDateAsc = (one: HasDate, two: HasDate): number => new Date(two.createdAt).getTime() - new Date(one.createdAt).getTime();
export const genUUID = (): string => uuidv4();

export type ImageFile = {
    name: string;
    type: string;
    uri: string;
};


export const getImgTypeForUri = (uri: string): string | undefined => {
    if (uri.indexOf(".png")) return 'image/png'
    if (uri.indexOf(".jpg") || uri.indexOf(".jpeg")) return 'image/jpeg'
}

export const askPermissionForCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
        alert("Permission to access camera is required!");
    }
    return permissionResult.granted
}

export const askPermissionForCameraRoll = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
    }
    return permissionResult.granted
}

const optionsForImage = {
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7
}

export const openImagePickerAsync = async (processImage: Function) => {
    if (!(await askPermissionForCameraRoll())) return
    const pickerResult = await ImagePicker.launchImageLibraryAsync(optionsForImage);
    processImage(pickerResult)
}

export const launchCameraAsync = async (processImage: Function) => {
    if (!(await askPermissionForCamera())) return
    if (!(await askPermissionForCameraRoll())) return
    const pickerResult = await ImagePicker.launchCameraAsync(optionsForImage);
    processImage(pickerResult)
}

export const getUri = (uri: string) => Platform.OS === "android" ? uri : uri.replace("file://", "");