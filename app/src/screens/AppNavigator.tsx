import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../modules/rootReducer";
import {logOutUser} from "../modules/Auth/authActions";
import {EditProfileScreen, EditProfileScreenName} from "./EditProfile/EditProfileScreen";
import {PostDetail} from "./PostDetail/PostDetail";
import {ProfileScreen} from "./ProfileScreen/ProfileScreen";
import {CreatePostScreen} from "./Home/CreatePost/CreatePostScreen";
import {getHeaderOptions, HomeScreen} from "./Home/HomeScreen";
import {LogInScreen} from "./LogIn/LogInScreen";
import {SignUpScreen} from "./SignUp/SignUpScreen";
import {FullOverlay} from "../components/FullOverlay";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Text, View} from "react-native";
import {Feather} from '@expo/vector-icons';
import {ProfilePhoto} from "../components/ProfilePhoto";
import {COLOR_PRIMARY} from "../constants/Colors";
import {UserObject} from "../modules/usersReducer";

export type ScreensParamsList = {
    Home: undefined;
    CreatePost: undefined;
    UserProfile: {
        user?: UserObject
    };
    PostDetail: undefined;
    EditProfile: undefined;
};
const Stack = createStackNavigator<ScreensParamsList>();

const Drawer = createDrawerNavigator();

const Screens = () => {
    return (
        <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{headerTintColor: '#fff'}}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({route}) => ({
                    headerTintColor: '#fff',
                    ...getHeaderOptions(route),
                })}/>
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={({route, navigation}) => ({
                    title: 'Create post',
                })}/>
            <Stack.Screen
                name="UserProfile"
                options={{
                    title: '',
                    // headerTransparent: true,
                }}
                component={ProfileScreen}/>
            <Stack.Screen
                name="PostDetail"
                component={PostDetail}/>
            <Stack.Screen
                name={EditProfileScreenName}
                component={EditProfileScreen}
                options={{
                    title: 'Edit Profile',
                    // headerTransparent: true,
                }}/>
        </Stack.Navigator>
    )
}

// @ts-ignore
const DrawerContent = props => {
    const dispatch = useDispatch()
    const userId = useSelector((state: MyAppState) => state.auth.userId)
    const users = useSelector((state: MyAppState) => state.entities.users.entities)
    if (!userId || !users) return null
    const currentUser = users[userId]
    if (!currentUser) return null

    const handleLogOut = () => dispatch(logOutUser());

    return (
        <View {...props} style={{
            flex: 1,
            justifyContent: 'space-between'
        }}>
            <DrawerContentScrollView style={{marginBottom: 40}}>
                <View style={{padding: 16, borderBottomWidth: 1, borderBottomColor: COLOR_PRIMARY}}>
                    <ProfilePhoto size={56} profilePhotoUrl={currentUser.profilePhotoUrl}/>
                    <Text style={{color: '#000', fontSize: 17, fontWeight: 'bold'}}>{currentUser.fullname}</Text>
                    <Text style={{color: '#898989', fontSize: 15}}>@{currentUser.username}</Text>
                </View>
                <DrawerItem
                    label={'Profile'}
                    onPress={() => console.log('hi Profile')}/>
                <DrawerItem
                    label={'Settings'}
                    onPress={() => console.log('hi Settings')}/>
                <DrawerItem
                    label={'Privacy policy'}
                    onPress={() => console.log('hi Privacy')}/>
            </DrawerContentScrollView>
            <View>
                <Text style={{fontSize: 12, marginLeft: 16}}>LSN Version 1.0.1</Text>
                <DrawerItem
                    label={'Log out'}
                    icon={() => (<Feather name="log-out" size={24} color="black"/>)}
                    onPress={handleLogOut}/>
            </View>
        </View>
    )
}

const Stack2 = createStackNavigator();

// @ts-ignore
export const AppNavigator = ({theme}) => {
    console.log("rendering Screens");
    const {auth} = useSelector((state: MyAppState) => state)

    return (<NavigationContainer theme={theme}>
        {auth.isAuthenticated ? <Drawer.Navigator
            drawerStyle={{backgroundColor: '#fff'}}
            drawerContent={props => <DrawerContent {...props}/>}>
            <Drawer.Screen
                name="Screens"
                component={Screens}/>
        </Drawer.Navigator> : <Stack2.Navigator
            screenOptions={{headerTintColor: '#fff'}}>
            <Stack2.Screen
                name="LogIn"
                component={LogInScreen}/>
            <Stack2.Screen
                name="SignUp"
                component={SignUpScreen}/>
        </Stack2.Navigator>}

        <FullOverlay isVisible={auth.isLoggingOut}/>
    </NavigationContainer>)
}

// @ts-ignore
// export const AppNavigator2 = ({theme}) => {
//     console.log("rendering AppNavigator");
//     const dispatch = useDispatch()
//
//     const {auth} = useSelector((state: MyAppState) => state)
//
//     return (<NavigationContainer theme={theme}>
//         <Stack.Navigator initialRouteName={auth.isAuthenticated ? 'Home' : 'LogIn'}
//                          screenOptions={{headerTintColor: '#fff'}}>
//             <Stack.Screen
//                 name="LogIn"
//                 component={LogInScreen}/>
//             <Stack.Screen
//                 name="SignUp"
//                 component={SignUpScreen}/>
//             <Stack.Screen
//                 name="Home"
//                 component={HomeScreen}
//                 options={({route}) => ({
//                     headerTintColor: '#fff',
//                     headerRight: () => (<HomeMenu onPress={() => dispatch(logOutUser())}/>),
//                     ...getHeaderOptions(route),
//                 })}/>
//             <Stack.Screen
//                 name="CreatePost"
//                 component={CreatePostScreen}
//                 options={({route, navigation}) => ({
//                     title: 'Create post',
//                 })}/>
//             <Stack.Screen
//                 name="UserProfile"
//                 options={{
//                     title: '',
//                     headerTransparent: true,
//                 }}
//                 component={ProfileScreen}/>
//             <Stack.Screen
//                 name="PostDetail"
//                 component={PostDetail}/>
//             <Stack.Screen
//                 name={EditProfileScreenName}
//                 component={EditProfileScreen}
//                 options={{
//                     title: 'Edit Profile',
//                     headerTransparent: true,
//                 }}/>
//         </Stack.Navigator>
//         <FullOverlay isVisible={auth.isLoggingOut}/>
//     </NavigationContainer>)
// }