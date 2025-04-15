import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Pressable, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import bcrypt from 'react-native-bcrypt';

const Login = ({ navigation, setIsLoggedIn }) => {

    const [valueinpu, setValueinpu] = useState('In');
    const [email, setEmail] = useState('');
    const [validemail, setValidemail] = useState(null)
    const [password, setPassword] = useState('');

    //for register
    const [reemail, setReEmail] = useState('');
    const [validreemail, setValidreemail] = useState(null)
    const [repassword, setRePassword] = useState('');
    const [refname, setRefname] = useState('');
    const [relname, setRelname] = useState('');
    const [reemployee, setReemployee] = useState('');
    const [rephone, setRephone] = useState('');
    const [reconpass, setReconpass] = useState('');
    const [hashrepass, setHashrepass] = useState('');





    useEffect(() => {
        if (email) {
            setValidemail(validateEmail(email));
        }
        if (reemail) {
            setValidreemail(validatereEmail(reemail));
        }
    }, [email, reemail]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) ? "true" : "false";
    };
    const validpassword = (password) => {
        const lengthpassword = password.length;
        console.log(lengthpassword);
    }

    //for register
    const validatereEmail = (reemail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) ? "true" : "false";
    };

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    // console.log(apiUrl);

    //for login api
    const gologin = async () => {
        // console.log("-------------------");
        try {
            const response = await axios.post(apiUrl + '/login', {
                email, password
            });
            if (response.data.data === "Successfully") {
                await AsyncStorage.setItem("token", response.data.token);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.log("error is Fetching : ", error);
        }
    }

    //for registration api
    const goregistration = async () => {
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(repassword, salt);
        // setHashrepass(hash);
        // console.log(hash);
        try {
            const response = await axios.post(apiUrl + '/agentregistration',
                {
                    refname, relname, reemail, hashrepass, reemployee, rephone
                }
            );
            // console.log(response.data);
            if (response.data == "Agent Info Added" || response.data == "Enter to all feild!.") {
                console.log("Flase");
            } else {
                console.log("True");
            }
        } catch (error) {
            console.log("Error is Fetching : ", error);
        }
    }

    return (
        <View style={styles.conatiner} >
            <View>
                <View style={styles.login1}>
                    <Pressable style={[styles.edit, valueinpu == 'In' && { borderBottomWidth: 1 }]} onPress={() => { setValueinpu('In') }}>
                        <Text style={{ color: '#309264', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Sign In</Text>
                    </Pressable>
                    <Pressable style={[styles.edit, valueinpu == 'Up' && { borderBottomWidth: 1 }]} onPress={() => { setValueinpu('Up') }}>
                        <Text style={{ color: '#309264', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Sign Up</Text>
                    </Pressable>
                </View>
            </View>
            {(valueinpu === "In") ? (
                <View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 30 }}>
                        <Text style={{ fontSize: 30 }}>Welcome Back!</Text>
                    </View>
                    <View style={{ display: 'flex', gap: 30 }}>
                        {(validateEmail === 'true' ? (
                            <Text>Valid email</Text>
                        ) : validemail === 'false' ? (
                            <Text style={{ paddingTop: 0, color: 'red' }}>Invalid email</Text>
                        ) : (
                            <Text></Text>
                        ))
                        }
                        <TextInput style={styles.searchbar} placeholder="Email" value={email} onChangeText={text => setEmail(text)} keyboardType="email-address"></TextInput>
                        <TextInput style={styles.searchbar} secureTextEntry={true} placeholder="Password" value={password} onChangeText={text => setPassword(text)}></TextInput>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Text style={{ color: 'black', paddingTop: 10 }}>Forget Password?</Text>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                        <Pressable style={styles.sign} onPress={gologin}>
                            <Text style={{ color: 'white', paddingTop: 7, paddingBottom: 7, paddingRight: 9, paddingLeft: 9, fontSize: 17 }} >Sign In</Text>
                        </Pressable>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'row', gap: 10, paddingTop: 40 }}>
                        <View style={styles.line} />
                        <Text style={{ fontSize: 15 }}>Or sign in with</Text>
                        <View style={styles.line} />
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                        <Pressable style={styles.sign}>
                            <Text style={{ color: 'white', paddingTop: 7, paddingBottom: 7, paddingRight: 9, paddingLeft: 9, fontSize: 17 }} >Renamble Tech</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 30 }}>
                            <Text style={{ fontSize: 30 }}>Create Account Now!</Text>
                        </View>
                        <View style={{ display: 'flex', gap: 30 }}>
                            <TextInput style={styles.searchbar} placeholder="First Name" value={refname} onChangeText={text => setRefname(text)}></TextInput>
                            <TextInput style={styles.searchbar} placeholder="LastName" value={relname} onChangeText={text => setRelname(text)}></TextInput>
                            <TextInput style={styles.searchbar} placeholder="Email" value={reemail} onChangeText={text => setReEmail(text)} keyboardType="email-address"></TextInput>
                            {/* {(validatereEmail === 'true' ? (
                                <Text>Valid email</Text>
                            ) : validreemail === 'false' ? (
                                <Text style={{ paddingTop: 0 }}>Invalid email</Text>
                            ) : (
                                <Text></Text>
                            ))
                            } */}
                            <TextInput style={styles.searchbar} placeholder="Employee ID" value={reemployee} onChangeText={text => setReemployee(text)}></TextInput>
                            <TextInput style={styles.searchbar} placeholder="Phone Number" value={rephone} onChangeText={text => setRephone(text)}></TextInput>
                            <TextInput style={styles.searchbar} secureTextEntry={true} placeholder="Password" value={repassword} onChangeText={text => setRePassword(text)}></TextInput>
                            <TextInput style={styles.searchbar} secureTextEntry={true} placeholder="Conform Password" value={reconpass} onChangeText={text => setReconpass(text)}></TextInput>
                        </View>


                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                            <Pressable style={styles.sign} onPress={goregistration}>
                                <Text style={{ color: 'white', paddingTop: 7, paddingBottom: 7, paddingRight: 9, paddingLeft: 9, fontSize: 17 }} >Sign Up</Text>
                            </Pressable>
                        </View>

                    </View>
                </ScrollView>
            )}
            {/* <Text>Login Screen</Text>
            <Button title="Home" onPress={() => { navigation.navigate('home') }}></Button> */}
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 30,
    },
    login1: {
        display: 'flex',
        gap: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 80,
    },
    sign: {
        backgroundColor: '#309264',
        borderRadius: 20,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    edit: {
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchbar: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 20
    },
    line: {
        borderBottomColor: 'bule',
        borderBottomWidth: 1,
        marginVertical: 10,
        width: 80
    },
    valid: {
        color: 'green',
    },
    invalid: {
        color: 'red',
    },
}
);

export default Login;