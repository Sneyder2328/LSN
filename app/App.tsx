import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import {COLOR_ACCENT, COLOR_PRIMARY, COLOR_PRIMARY_DARK} from "./constants/Colors";
import {Text} from "react-native";
import {LogInScreen} from "./screens/LogIn/LogInScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, DefaultTheme as NavigationDefaultTheme} from "@react-navigation/native";
import {Provider as PaperProvider, DefaultTheme as PaperDefaultTheme} from 'react-native-paper';
import {SignUpScreen} from "./screens/SignUp/SignUpScreen";
import { Provider } from "react-redux";
import {store} from "./src/store";
import {Home} from "./navigation";

// export default function App() {
//     const isLoadingComplete = useCachedResources();
//     const colorScheme = useColorScheme();
//
//     if (!isLoadingComplete) {
//         return null;
//     } else {
//         return (
//             <SafeAreaProvider>
//                 <LogInScreen/>
//                 {/*<Navigation colorScheme={colorScheme} />*/}
//                 {/*<StatusBar backgroundColor={BACKGROUND_COLOR_DARK}/>*/}
//             </SafeAreaProvider>
//         );
//     }
// }

const MyTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme,
    dark: true,
    colors: {
        ...PaperDefaultTheme.colors,
        ...NavigationDefaultTheme.colors,
        // shared
        primary: COLOR_PRIMARY,
        background: '#fff',
        text: '#000',
        // navigationTheme
        card: COLOR_PRIMARY,
        // paperTheme
        accent: COLOR_ACCENT,
        backdrop: '#00f',
        surface: '#00f',
        disabled: '#bbdefb'
    },
};

const Stack = createStackNavigator();

export default () => {
    return (<Provider store={store}>
            <PaperProvider theme={MyTheme}>
                <NavigationContainer theme={MyTheme} >
                    <Stack.Navigator initialRouteName={'LogIn'}>
                        <Stack.Screen name="LogIn" component={LogInScreen} options={{
                            headerTintColor: '#fff'
                        }}/>
                        <Stack.Screen name="SignUp" component={SignUpScreen} options={{
                            headerTintColor: '#fff'
                        }}/>
                        <Stack.Screen name="Home" component={Home} options={{
                            headerTintColor: '#fff'
                        }}/>
                    </Stack.Navigator>
                </NavigationContainer>
                <StatusBar backgroundColor={COLOR_PRIMARY_DARK} style={'light'}/>
            </PaperProvider>
        </Provider>)
}