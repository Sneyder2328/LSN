import {UserSearch} from "../modules/Search/searchReducer";
import {Text, View} from "react-native";
import * as React from "react";
import {ProfilePhoto} from "./ProfilePhoto";

export const SearchResult = ({user}:{user: UserSearch}) => {
    return (<View style={{
        flex: 1,
        flexDirection: 'row',
        // backgroundColor: '#0f0',
        marginBottom: 8,
    }}>
        <ProfilePhoto size={52} profilePhotoUrl={user.profilePhotoUrl}/>
        <View style={{
            // backgroundColor: '#00f',
            justifyContent: 'center',
            marginLeft: 6,
        }}>
            <Text style={{
                color: '#000',
                fontSize: 16,
                // backgroundColor: '#f00',
            }}>{user.fullname}</Text>
            <Text style={{
                color: '#767676',
                fontSize: 15,
                // backgroundColor: '#0ff',
            }}>@{user.username}</Text>
        </View>
    </View>)
}