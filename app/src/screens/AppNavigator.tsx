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
import {HomeMenu} from "../components/HomeMenu";
import {HomeScreen} from "./Home/HomeScreen";
import {LogInScreen} from "./LogIn/LogInScreen";
import {SignUpScreen} from "./SignUp/SignUpScreen";
import {FullOverlay} from "../components/FullOverlay";

const Stack = createStackNavigator();

// const {isAuthenticated} = useSelector((state: MyAppState) => state.auth)
//
// useEffect(() => {
//     console.log("isAuthenticated=", isAuthenticated);
// }, [])
// //isAuthenticated ? 'Home' : 'LogIn'

//<Text onPress={showMenu}>Show menu</Text>


// @ts-ignore
export const AppNavigator = ({theme}) => {
    console.log("rendering AppNavigator");
    const dispatch = useDispatch()

    const {auth} = useSelector((state: MyAppState) => state)

    return (<NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName={auth.isAuthenticated ? 'Home' : 'LogIn'}
                         screenOptions={{headerTintColor: '#fff'}}>
            <Stack.Screen
                name="LogIn"
                component={LogInScreen}/>
            <Stack.Screen
                name="SignUp"
                component={SignUpScreen}/>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={(route) => ({
                    headerTintColor: '#fff',
                    // headerTitle: getHeaderTitle(route),
                    // title: 'LSN',
                    headerRight: () => <HomeMenu onPress={() => dispatch(logOutUser())}/>
                })}/>
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={({route, navigation}) => ({
                    title: 'Create post',
                    // headerRight: () => <PostButton onPress={()=> {
                    //     console.log('post', route)
                    //     // @ts-ignore
                    //     dispatch(createPost({id:genUUID(), imageFiles: [], text: route.params.text, userId: route.params.userId}))
                    //     navigation.goBack()
                    //
                    // }}/>
                })}/>
            <Stack.Screen
                name="UserProfile"
                options={{
                    title: '',
                    headerTransparent: true,
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
                    headerTransparent: true,
                }}/>
        </Stack.Navigator>
        <FullOverlay isVisible={auth.isLoggingOut}/>
    </NavigationContainer>)
}