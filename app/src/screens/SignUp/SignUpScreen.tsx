import {Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {Button, TextInput, useTheme} from "react-native-paper";
import {FORM_FONT_SIZE} from "../../constants/Colors";
import {useDispatch, useSelector} from "react-redux";
import {MyAppState} from "../../reducers/rootReducer";
import {signUpUser} from "../../actions/authActions";
import {FieldErrors, useForm} from 'react-hook-form'
import {FullOverlay} from "../../components/FullOverlay";

type SignUpFormParams = { username: string, password: string, email: string, fullname: string };

export const SignUpScreen = ({navigation}: { navigation: any }) => {
    const [username, setUsername] = useState<string>('')
    const [fullname, setFullname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {auth} = useSelector((state: MyAppState) => state)
    const dispatch = useDispatch()
    const {colors} = useTheme();

    const {register, handleSubmit, setValue} = useForm< SignUpFormParams>()

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

    useEffect(() => {
        register("fullname", {
            required: {value: true, message: 'Please enter your full name'},
            minLength: {value: 5, message: 'This field needs to be at least 5 characters long'}
        })
        register('username', {
            required: {value: true, message: 'Please enter a username'},
            pattern: {value: /^\w+$/, message: 'Username must contain only alphanumeric values'},
            minLength: {value: 5, message: 'Username must be at least 5 characters long'}
        })
        register('email', {
            required: {value: true, message: 'Please enter your email address'},
            pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Please provide a properly formatted email address'
            }
        })
        register('password', {
            required: {value: true, message: 'Please enter your password'},
            minLength: {value: 8, message: 'Your password needs to be at least 8 characters long'}
        })
    }, [register])

    useEffect(() => {
        setValue("username", username)
        setValue("fullname", fullname)
        setValue('email', email)
        setValue('password', password)
    }, [username, password, email, fullname])

    const onValidData = (data: SignUpFormParams) => {
        console.log('onValidData', data);
        if (auth.isSigningUp) return
        dispatch(signUpUser(data))
    }
    const onInvalidData = (errors: FieldErrors) => {
        console.log('onInvalidData', errors);
        if (auth.isSigningUp) return
        alert(Object.values(errors)[0].message)
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
                onPress={handleSubmit(onValidData, onInvalidData)} loading={auth.isSigningUp}>
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
