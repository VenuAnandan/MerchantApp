import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const ChatPage = ({ navigation, route }) => {

    const { item } = route.params;

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
                const response = await axios.post(apiUrl + '/chats', { dataid: item }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                // console.log(response.data.message);
                if (response.data.message == 'Chats founded') {
                    setMessages(response.data.data.coversation);
                    setStoreName(response.data.storeName);
                } else {
                    setMessages();
                    setStoreName("Store Name");
                }
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

    const formatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date)) return 'Invalid date & time';

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
            return 'Invalid date & time';
        }
    };


    const renderItem = ({ item }) => (
        <View style={[styles.messageRow, item.from === 'store' ? styles.leftAlign : styles.rightAlign]}>
            {item.from === 'store' && <Image style={styles.avatar} source={{ uri: 'https://img.icons8.com/?size=100&id=77118&format=png&color=000000' }} />}

            <View style={item.from === 'store' ? styles.bubbleLeft : styles.bubbleRight}>
                <Text style={item.from === 'store' ? styles.messageText : styles.messageTextRight}>{item.message}</Text>
                <Text style={item.from === 'store' ? styles.timestamp : styles.timestampright}>
                    {/* 19/06/22   09:41 AM  */}
                    {/* {item.date} */}
                    {formatDateTime(item.date)}
                </Text>
            </View>

            {item.from !== 'store' && <Image style={styles.avatar} source={{ uri: 'https://img.icons8.com/?size=100&id=qFpJLw42Vi78&format=png&color=000000' }} />}
        </View>
    );


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.conatiner}
            keyboardVerticalOffset={90}>

            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', width: '90%', marginLeft: '5%' }}>
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
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
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
        // padding: 20,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 20
    },
    tickets: {
        width: '100%',
        height: '90%',
        // backgroundColor:'yellow'
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 8,
        // paddingHorizontal: 10,
        maxWidth: '90%',
    },
    leftAlign: {
        alignSelf: 'flex-start',
    },
    rightAlign: {
        alignSelf: 'flex-end',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 6,
    },
    bubbleLeft: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 12,
        elevation: 2,
        maxWidth: '80%',
    },
    bubbleRight: {
        backgroundColor: '#25d366',
        padding: 10,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 8,
        elevation: 2,
        maxWidth: '80%',
    },
    messageText: {
        color: '#000',
        fontSize: 15,
        lineHeight: 20,
    },
    messageTextRight: {
        color: 'white',
        fontSize: 15,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 11,
        color: '#555',
        marginTop: 4,
        textAlign: 'right',
    },
    timestampright: {
        fontSize: 11,
        color: 'white',
        marginTop: 4,
        textAlign: 'right',
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
}
);

export default ChatPage;