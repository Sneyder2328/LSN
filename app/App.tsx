import {StatusBar} from 'expo-status-bar';
// @ts-ignore
import {PersistGate} from 'redux-persist/integration/react';
import React from 'react';

import {COLOR_ACCENT, COLOR_PRIMARY, COLOR_PRIMARY_DARK} from "./src/constants/Colors";
import {DefaultTheme as NavigationDefaultTheme} from "@react-navigation/native";
// @ts-ignore
import {Provider as PaperProvider, DefaultTheme as PaperDefaultTheme} from 'react-native-paper';
import {Provider} from "react-redux";
import {persistor, store} from "./src/store";
import {removeAuthTokenHeaders, setAccessTokenHeaders} from "./src/modules/api";
import {AppNavigator} from "./src/screens/AppNavigator";

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
        surface: '#fff',
        disabled: '#ff4b13'
    },
};

export default () => {
    return (<Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={MyTheme}>
                <AppNavigator theme={MyTheme}/>
                <StatusBar backgroundColor={COLOR_PRIMARY_DARK} style={'light'}/>
            </PaperProvider>
        </PersistGate>
    </Provider>)
}

let currentValue: string | undefined

function handleChange() {
    const previousValue = currentValue
    currentValue = store.getState().auth.accessToken

    if (previousValue !== currentValue) {
        console.log('accessToken changed from', previousValue, 'to', currentValue)
        if (currentValue) {
            setAccessTokenHeaders(currentValue);
        } else if(previousValue){
            removeAuthTokenHeaders()
        }
    }
}

store.subscribe(handleChange)