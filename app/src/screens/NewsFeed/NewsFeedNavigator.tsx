import {createStackNavigator} from "@react-navigation/stack";
import {NewsFeedScreen} from "./NewsFeedScreen";
import {CreatePostScreen} from "../Home/CreatePost/CreatePostScreen";
import * as React from "react";
import {PostDetail} from "../PostDetail/PostDetail";

const NewsFeedStack = createStackNavigator<{
    NewsFeed: undefined;
    CreatePost: undefined;
    PostDetail: undefined;
}>();

export const NewsFeedNavigator = () => {
    return (
        <NewsFeedStack.Navigator initialRouteName={'NewsFeed'}>
            <NewsFeedStack.Screen
                name="NewsFeed"
                component={NewsFeedScreen}
                // options={()=>({title: 'News Feed'})}
            />
            <NewsFeedStack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={()=>({title: 'Create post'})}
            />
            <NewsFeedStack.Screen
                name="PostDetail"
                component={PostDetail}
                // options={{
                //     header
                // }}
            />
        </NewsFeedStack.Navigator>
    );
}


// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
