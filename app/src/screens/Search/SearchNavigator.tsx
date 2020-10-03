import {createStackNavigator} from "@react-navigation/stack";
import * as React from "react";
import {SearchScreen} from "./SearchScreen";

const SearchStack = createStackNavigator<{
    Search: undefined;
}>();

export const SearchNavigator = () => {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="Search"
                component={SearchScreen}
                options={{headerTitle: 'Tab Two Title'}}
            />
        </SearchStack.Navigator>
    );
}
