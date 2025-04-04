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
                // console.log(response.data.message);
                // console.log(response.data.data);
                setMessages(response.data.data);
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        Ticketrises();
    }, [])


    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationContainer}>
            <Feather name="bell" size={24} color="black" />
            <View style={styles.textContainer}>
                <Text style={styles.notificationHeading}>{item.storeName}</Text>
                <Text style={styles.notificationText}>{item.message}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
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
                <FlatList
                    style={styles.tickets}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id} />
            ) : (
                <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }} />
                    <Text>No Stores</Text>
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
        marginTop: 20
    },

    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    bellIcon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    notificationHeading: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    notificationText: {
        color: '#ddd',
        fontSize: 14,
    },
}
);

export default TicketRise;