import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import {Button, TextInput} from "react-native-paper";
import {FORM_FONT_SIZE} from "../../constants/Colors";
import {useDispatch, useSelector} from "react-redux";
import {logInUser} from "../../src/authActions";
import {MyAppState} from "../../src/mainReducer";

export const LogInScreen = ({navigation}: { navigation: any }) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {auth} = useSelector((state: MyAppState) => state)
    const dispatch = useDispatch()

    useEffect(() => {
        if (auth.isAuthenticated){
            navigation.replace('Home')
        }
    }, [auth.isAuthenticated])

    const logIn = async () => {
        console.log('Log In Clicked', username, password)
        dispatch(logInUser({username, password}))
    }

    return <View style={styles.container}>
        <Text style={styles.title}>LSN</Text>
        <TextInput style={styles.input} mode='outlined' placeholder={'Username'}
                   label="Username" value={username} onChangeText={setUsername}/>
        <TextInput style={styles.input} mode='outlined' placeholder={'Password'}
                   secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}/>
        <Button
            style={styles.btn} mode="contained" onPress={logIn}>
            Log In
        </Button>
        <TouchableOpacity onPress={() => {
            console.log('going back')
            navigation.navigate('SignUp')
        }}>
            <Text style={styles.signUpBtn}>Sign Up</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 40,
        textAlign: "center"
    },
    input: {
        marginRight: 32,
        marginLeft: 32,
        marginTop: 16,
        fontSize: FORM_FONT_SIZE,
    },
    btn: {
        marginRight: 32,
        marginLeft: 32,
        marginTop: 16,
        fontSize: 20
    },
    signUpBtn: {
        marginTop: 20,
        padding: 16,
        fontSize: FORM_FONT_SIZE,
        alignSelf: 'center',
        color: '#039fff'
    }
})
