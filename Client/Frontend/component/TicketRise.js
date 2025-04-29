import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const TicketRise = ({ navigation }) => {


    const [messages, setMessages] = useState(
        //     [
        //     { id: '1', heading: 'New Message', text: 'You have a new message waiting for you!' },
        //     { id: '2', heading: 'Update Available', text: 'There is a new update for your app.' },
        //     { id: '3', heading: 'Reminder', text: 'Don’t forget to check your settings.' },
        // ]
    );

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const Ticketrises = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(apiUrl + '/getticketrise', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                if (response.data.message == "Ticket Rise Stores") {
                    // console.log(response.data.data[0].id);
                    setMessages(response.data.data);
                } else {
                    setMessages();
                }
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        Ticketrises();
    }, [])


    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => navigation.navigate('ChatPage', { item: item.id })}>
            <View style={styles.iconContainer}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: 'https://img.icons8.com/?size=100&id=J9HI0E0FAXG5&format=png&color=000000' }} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.notificationHeading}>{item.storeName}</Text>
                <Text style={styles.notificationText}>{item.message}</Text>
            </View>

            <Text style={styles.arrowIcon}>›</Text>
            {/* <Image
                style={styles.arrowIcon}
                source={{ uri: 'https://img.icons8.com/?size=100&id=61&format=png&color=000000' }} /> */}
        </TouchableOpacity>
    );


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Tickets Rises</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            {messages ? (
                <View>
                    <Text style={{ fontSize: 17, fontStyle: 'italic' }}>Below is the list of tickets you have raised. Track the status or follow up on any issue from here.
                        {/* <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}> MyDevices</Text> */}
                    </Text>
                    <FlatList
                        style={styles.tickets}
                        data={messages}
                        renderItem={renderItem} />
                </View>
            ) : (
                <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }} />
                    <Text>No Ticket Rises</Text>
                </View>
            )}

        </View>
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
        marginTop: 20,
        paddingHorizontal: 16,
    },

    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    textContainer: {
        flex: 1,
    },

    notificationHeading: {
        color: '#1c1c1e',
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },

    notificationText: {
        color: '#6e6e73',
        fontSize: 14,
    },

    arrowIcon: {
        marginLeft: 10,
        color: '#6e6e73',
        // width: '10%',
        // height: '60%'
    },
}
);

export default TicketRise;