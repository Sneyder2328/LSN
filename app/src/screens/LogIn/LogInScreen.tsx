import {Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {Button, TextInput, useTheme} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {FullOverlay} from "../../components/FullOverlay";
import {FORM_FONT_SIZE} from "../../constants/Colors";
import {MyAppState} from "../../modules/rootReducer";
import {logInUser} from "../../modules/Auth/authActions";

export const LogInScreenName = "LogInScreen"
export const LogInScreen = ({navigation}: { navigation: any }) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {auth} = useSelector((state: MyAppState) => state)
    const dispatch = useDispatch()
    const {colors} = useTheme();

    // useEffect(() => {
    //     console.log("LogInScreen isAuthenticated", auth.isAuthenticated);
    //     if (auth.isAuthenticated) {
    //         navigation.replace('Home')
    //     }
    // }, [auth.isAuthenticated])

    useEffect(() => {
        if (auth.logInError) {
            Alert.alert('Login Failed', auth.logInError)
        }
    }, [auth.logInError])

    const logIn = () => {
        if (username.length === 0) {
            alert("Please enter your username")
            return
        }
        if (password.length === 0) {
            alert("Please enter your password")
            return
        }
        dispatch(logInUser({username, password}))
    }

    return (<ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>LSN</Text>
        <TextInput style={styles.input} mode='outlined' placeholder={'Username'} autoCorrect={false}
                   label="Username" value={username} onChangeText={setUsername}
                   returnKeyType={'next'} autoCapitalize={'none'}/>
        <TextInput style={styles.input} mode='outlined' placeholder={'Password'} autoCorrect={false}
                   secureTextEntry={true} label="Password" value={password} onChangeText={setPassword}
                   returnKeyType={'send'} autoCapitalize={'none'}/>
        <Button
            style={styles.btn} mode="contained" color={colors.accent}
            onPress={() => !auth.isLoggingIn && logIn()} loading={auth.isLoggingIn}>
            Log In
        </Button>
        <TouchableOpacity onPress={() => {
            navigation.replace('SignUp')
        }}>
            <Text style={styles.signUpBtn}>Sign Up</Text>
        </TouchableOpacity>
        <FullOverlay isVisible={auth.isLoggingIn}/>
    </ScrollView>)
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
