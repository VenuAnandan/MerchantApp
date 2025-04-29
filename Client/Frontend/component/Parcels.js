import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const Parcels = ({ navigation, route }) => {

    const [parcels, setParcels] = useState();
    const {item} = route.params;
    console.log(item);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getparcels = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log('Token is empty');
            } else {
                try {
                    const response = await axios.post('http://192.168.1.7:5000/parcel/agentid', {
                        "agentid": item
                    });
                    setParcels(response.data.data);
                    // console.log(response.data.data[0], "parcels");
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getparcels();
    }, [])



    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => navigation.navigate('ParcelInfo', { item: item.parcelNumber })}
            activeOpacity={0.85}
        >
            <View style={styles.iconContainer}>
                <Image
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: 'https://th.bing.com/th/id/OIP.6n0gYZ_FOFWe3XZDGSutKQAAAA?w=178&h=170&c=7&r=0&o=5&pid=1.7' }} />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.notificationHeading}>
                    Parcel Number : {item.parcelNumber}
                </Text>
                <Text style={styles.notificationText}>
                    Sender : {item.supportname}
                </Text>

                {/* <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) },
                    ]}
                >
                    <Text style={styles.statusText}>{item.status}</Text>
                </View> */}
            </View>

            <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>
    );


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Parcels</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            {parcels ? (
                <View>
                    <Text style={{ fontSize: 17, fontStyle: 'italic' }}>The following parcels have been assigned to the agent. Please review the details and ensure timely delivery and confirmation.
                        {/* <Text style={{ fontWeight: 'bold', fontSize: 20, fontStyle: 'italic' }}> MyDevices</Text> */}
                    </Text>
                    <FlatList
                        style={styles.tickets}
                        data={parcels}
                        renderItem={renderItem} />
                </View>
            ) : (
                <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }} />
                    <Text>No Parcels assigned</Text>
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
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            },
        }),
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
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },

    notificationText: {
        color: '#6e6e73',
        fontSize: 14,
    },

    arrowIcon: {
        marginLeft: 10,
        fontSize: 20,
        color: '#6e6e73',
    },

    statusBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginTop: 6,
    },

    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
}
);

export default Parcels;