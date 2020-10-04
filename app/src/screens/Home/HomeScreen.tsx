import * as React from 'react';

import {useSelector} from "react-redux";
import {MyAppState} from "../../reducers/rootReducer";
import {useEffect} from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {NewsFeedNavigator} from "../NewsFeed/NewsFeedNavigator";
import {SearchNavigator} from "../Search/SearchNavigator";
import {useNavigation, useRoute} from "@react-navigation/native";
import {MaterialIcons} from '@expo/vector-icons';

// export function getHeaderTitle(route: any) {
//     // If the focused route is not found, we need to assume it's the initial screen
//     // This can happen during if there hasn't been any navigation inside the screen
//     // In our case, it's "Feed" as that's the first screen inside the navigator
//     const routeName = getFocusedRouteNameFromRoute(route) ?? 'NewsFeed';
//
//     switch (routeName) {
//         case 'NewsFeed':
//             return 'News feed';
//         case 'Search':
//             return 'Search';
//     }
// }

const BottomTab = createMaterialTopTabNavigator<{
    NewsFeed: undefined;
    Search: undefined;
    Profile: undefined;
    Notifications: undefined;
}>();

export const HomeScreen = () => {
    const {isAuthenticated} = useSelector((state: MyAppState) => state.auth)
    const navigation = useNavigation();
    const route = useRoute()

    useEffect(() => {
        if (!isAuthenticated) {
            // @ts-ignore
            navigation.replace('LogIn')
        }
    }, [isAuthenticated])

    // React.useLayoutEffect(() => {
    //     console.log('route=', getHeaderTitle(route));
    //     navigation.setOptions({ title: getHeaderTitle(route) });
    // }, [navigation, route]);


    return (
        <BottomTab.Navigator
            initialRouteName="NewsFeed"
            backBehavior={'initialRoute'}
            lazy={true}
            lazyPreloadDistance={1}
            // labeled={false}
            // activeColor={'#fff'}
            // inactiveColor={'#84c5fc'}
            // shifting={false}
            // barStyle={{
            //     justifyContent: 'space-between'
            // }}
            tabBarPosition={'bottom'}
            tabBarOptions={{
                activeTintColor: "#fff",
                inactiveTintColor: "#84c5fc",
                showLabel: false,
                showIcon: true,
                scrollEnabled: false,
                iconStyle: {
                    width: 28,
                    height: 28,
                }
            }}
        >
            <BottomTab.Screen
                name="NewsFeed"
                component={NewsFeedNavigator}
                options={{
                    title: 'NewsFeed',
                    tabBarIcon: ({color}: { color: string }) => <TabBarIcon name="home" color={color}/>,
                }}
            />
            <BottomTab.Screen
                name="Search"
                component={SearchNavigator}
                options={{
                    tabBarIcon: ({color}: { color: string }) => <TabBarIcon name="search" color={color}/>,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={SearchNavigator}
                options={{
                    tabBarIcon: ({color}: { color: string }) => <TabBarIcon name="person" color={color}/>,
                }}
            />
            <BottomTab.Screen
                name="Notifications"
                component={SearchNavigator}
                options={{
                    tabBarIcon: ({color}: { color: string }) => <TabBarIcon name="notifications" color={color}/>,
                }}
            />
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
    // <MaterialIcons name="home" size={24} color="black" />
    return <MaterialIcons size={28} style={{marginBottom: -3}} {...props} />;
}

