import {Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {Button, TextInput, useTheme} from "react-native-paper";
import {FORM_FONT_SIZE} from "../../constants/Colors";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../../reducers/rootReducer";
import {logInUser, signUpUser} from "../../actions/authActions";
import {FullOverlay} from "../../components/FullOverlay";

export const SignUpScreen = ({navigation}: { navigation: any }) => {
    const [username, setUsername] = useState<string>('')
    const [fullname, setFullname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {auth} = useSelector((state: MyAppState) => state)
    const dispatch = useDispatch()
    const {colors} = useTheme();

    useEffect(() => {
        console.log("SignUpScreen isAuthenticated", auth.isAuthenticated);
        if (auth.isAuthenticated) {
            navigation.replace('Home')
        }
    }, [auth.isAuthenticated])

    useEffect(() => {
        if (auth.signUpError) {
            Alert.alert('Signup Failed', auth.signUpError)
        }
    }, [auth.signUpError])


    const signUp = async () => {
        console.log('Sign Up Clicked')
        dispatch(signUpUser({username, password, email, fullname}))
    }

    return (<ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>LSN</Text>
        <TextInput style={styles.input} mode='outlined' label="Full name" placeholder={'Full name'}
                   value={fullname} onChangeText={setFullname}/>
        <TextInput style={styles.input} mode='outlined' label="Username" placeholder={'Username'}
                   value={username} onChangeText={setUsername}/>
        <TextInput style={styles.input} mode='outlined' label="Email" placeholder={'Email'}
                   value={email} onChangeText={setEmail}/>
        <TextInput style={styles.input} mode='outlined' label="Password"
                   secureTextEntry={true} placeholder={'Password'}
                   value={password} onChangeText={setPassword}/>
        <Button style={styles.btn} mode="contained" color={auth.isSigningUp ? colors.disabled : colors.accent}
                onPress={() => !auth.isSigningUp && signUp()} loading={auth.isSigningUp}>
            Sign Up
        </Button>
        <TouchableOpacity onPress={() => {
            navigation.replace('LogIn')
        }}>
            <Text style={styles.backBtn}>Back to Log In</Text>
        </TouchableOpacity>
        <FullOverlay isVisible={auth.isSigningUp}/>
    </ScrollView>)
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
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
    backBtn: {
        marginTop: 20,
        padding: 16,
        fontSize: FORM_FONT_SIZE,
        alignSelf: 'center',
        color: '#039fff'
    }
})
