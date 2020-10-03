import * as React from 'react';

import {useSelector} from "react-redux";
import {MyAppState} from "../../reducers/rootReducer";
import {useEffect} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import {NewsFeedNavigator} from "../NewsFeed/NewsFeedNavigator";
import {SearchNavigator} from "../Search/SearchNavigator";
import {useNavigation, useRoute, getFocusedRouteNameFromRoute} from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';

export function getHeaderTitle(route: any) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'NewsFeed';

    switch (routeName) {
        case 'NewsFeed':
            return 'News feed';
        case 'Search':
            return 'Search';
    }
}

const BottomTab = createBottomTabNavigator<{
    NewsFeed: undefined;
    Search: undefined;
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
            tabBarOptions={{
                activeTintColor: "#fff",
                inactiveTintColor: "#84c5fc",
                showLabel: false
            }}>
            <BottomTab.Screen
                name="NewsFeed"
                component={NewsFeedNavigator}
                options={{
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
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
    // <MaterialIcons name="home" size={24} color="black" />
    return <MaterialIcons size={30} style={{marginBottom: -3}} {...props} />;
}

