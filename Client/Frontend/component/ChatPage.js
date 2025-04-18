import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const ChatPage = ({ navigation }) => {


    const [messages, setMessages] = useState(
        //     [
        //     { id: '1', heading: 'New Message', text: 'You have a new message waiting for you!' },
        //     { id: '2', heading: 'Update Available', text: 'There is a new update for your app.' },
        //     { id: '3', heading: 'Reminder', text: 'Don’t forget to check your settings.' },
        // ]
    );
    const [storename, setStoreName] = useState('');

    const [mess, setMess] = useState('');

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const Ticketrises = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(apiUrl + '/chats', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                setMessages(response.data.data.coversation);
                setStoreName(response.data.storeName);
                // console.log(response.data.data.coversation);
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        Ticketrises();
    }, [mess]);


    const chattostore = async () => {
        if (!mess) {
            console.log('Empty Message');
        } else {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log('Token is Missing');
            } else {
                try {
                    const response = await axios.post(apiUrl + '/chattostorekeeper', {
                        message: mess
                    }, {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    setMess('');
                } catch (error) {
                    console.log("Error is : ", error);
                }
            }
        }
    }


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationContainer}>
            {item.from == 'store' ? (
                <View style={styles.textContainerstore}>
                    <View style={styles.fromstore}>
                        <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=77118&format=png&color=000000' }}></Image>
                        <Text style={styles.notificationTextA}>{item.message}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.textContaineragent}>
                    <View style={styles.fromagent}>
                        <Text style={styles.notificationTextS}>{item.message}</Text>
                        <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=qFpJLw42Vi78&format=png&color=000000' }}></Image>
                    </View>

                </View>
            )}
        </TouchableOpacity>
    );


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.conatiner}
            keyboardVerticalOffset={90}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, borderRadius: 50, display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                            <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontSize: 20, color: 'white' }}>{storename}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ width: 40, height: 40, borderRadius: 50, display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                            <View><AntDesign name="close" size={24} color="white" /></View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ flex: 1 }}> */}
                    {messages ? (
                        <View style={{ flex: 1, width: '100%' }}>
                            <View>
                                <FlatList
                                    style={styles.tickets}
                                    data={messages}
                                    renderItem={renderItem}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 100 }}
                                />
                            </View>
                            <View style={styles.messcontainer}>
                                <TextInput
                                    placeholder="Message"
                                    value={mess}
                                    onChangeText={setMess}
                                    style={styles.chatmes}
                                />
                                <TouchableOpacity style={styles.sendchat} onPress={chattostore}>
                                    <Text style={{ color: 'white' }}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                            <Image
                                style={{ width: 200, height: 200 }}
                                source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }}
                            />
                            <Text>No Stores</Text>
                        </View>
                    )}
                    {/* </View> */}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
        marginTop: 20
    },
    tickets: {
        width: '100%',
        height: '90%',
        // backgroundColor:'yellow'
    },
    message: {
        // position: 'relative',
    },
    fromstore: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fromagent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 0,
        padding: 5
    },
    notificationContainer: {
        width: '100%',
        height: 40,
    },
    bellIcon: {
        marginRight: 10,
    },
    textContainerstore: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    textContaineragent: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignSelf: 'flex-end'
    },
    notificationHeading: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    notificationTextA: {
        borderWidth: 0.3,
        padding: 4,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 0
    },
    notificationTextS: {
        borderWidth: 0.3,
        padding: 4,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 10
    },
    messcontainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        // // position: 'absolute',
        // // marginTop: '170%',
        // position: 'absolute',
        // bottom: 0,
        // margin:0,
        // left: 0,
        // right: 0,
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingHorizontal: 10,
        // paddingVertical: 8,
        // backgroundColor: '#fff',
        // borderColor: '#ccc',
        // height:'20%'
        width: '100%',
        height: 70,
        // backgroundColor: 'white'

    },
    chatmes: {
        width: '75%',
        borderWidth: 1,
        borderRadius: 20,
        // padding:10
    },
    sendchat: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#309264',
        width: '20%',
        padding: 10,
        borderRadius: 50
    },
    image2: {
        width: 30,
        height: 30,
    }
}
);

export default ChatPage;