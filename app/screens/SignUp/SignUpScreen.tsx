import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import React from "react";
import {Button, TextInput} from "react-native-paper";
import {FORM_FONT_SIZE} from "../../constants/Colors";

export const SignUpScreen = ({navigation}: { navigation: any }) => {
    return <View style={
        {
            flex: 1,
            borderWidth: 4,
            borderColor: 'red',
        }}>
        <ScrollView contentContainerStyle={styles.container} centerContent={true}>
            <Text style={styles.title}>LSN</Text>
            <TextInput style={styles.input} mode='outlined' label="Full name" placeholder={'Full name'}/>
            <TextInput style={styles.input} mode='outlined' label="Username" placeholder={'Username'}/>
            <TextInput style={styles.input} mode='outlined' label="Email" placeholder={'Email'}/>
            <TextInput style={styles.input} mode='outlined' label="Password"
                       secureTextEntry={true} placeholder={'Password'}/>
            <Button style={styles.btn} mode="contained" onPress={() => console.log('SignUp clicked')}>
                Sign Up
            </Button>
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff</Button>*/}
            {/*<Button>fff54</Button>*/}
            {/*<Button>fff54</Button>*/}
            {/*<Button>fff54</Button>*/}
            {/*<Button>fff5464465</Button>*/}
            <TouchableOpacity onPress={() => {
                console.log('going back')
                navigation.navigate('LogIn')
            }}>
                <Text style={styles.backBtn}>Back to Log In</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: 'green',
        // flex: 1,
        // justifyContent: 'center',
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
