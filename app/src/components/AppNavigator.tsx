import {HomeMenu} from "./HomeMenu";
import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {LogInScreen} from "../screens/LogIn/LogInScreen";
import {SignUpScreen} from "../screens/SignUp/SignUpScreen";
import {getHeaderTitle, HomeScreen} from "../screens/Home/HomeScreen";
import {MyAppState} from "../reducers/rootReducer";
import {useDispatch, useSelector} from "react-redux";
import {logOutUser} from "../actions/authActions";
import {FullOverlay} from "./FullOverlay";
import {CreatePostScreen} from "../screens/Home/CreatePost/CreatePostScreen";
import {Text} from "react-native";
import {PostDetail} from "../screens/PostDetail/PostDetail";
import {PostButton} from "./PostButton";
import {createPost} from "../actions/postsActions";
import {genUUID} from "../utils/utils";

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
                    headerTitle: getHeaderTitle(route),
                    // title: 'LSN',
                    headerRight: () => <HomeMenu onPress={() => dispatch(logOutUser())}/>
                })}/>
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={({route, navigation}) => ({
                    title: 'Create post',
                    headerRight: () => <PostButton onPress={()=> {
                        console.log('post', route)
                        // @ts-ignore
                        dispatch(createPost({id:genUUID(), imageFiles: [], text: route.params.text, userId: route.params.userId}))
                        navigation.goBack()

                    }}/>
                })}/>
            <Stack.Screen
                name="PostDetail"
                component={PostDetail}
                // options={{
                //     header
                // }}
            />
        </Stack.Navigator>
        <FullOverlay isVisible={auth.isLoggingOut}/>
    </NavigationContainer>)
}