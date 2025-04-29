import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const ParcelInfo = ({ navigation, route }) => {

    const [parcelinfo, setParcelinfo] = useState();
    const [parceldevices, setParceldevices] = useState();
    const [parcelAccess, setParecelAccess] = useState();
    const { item } = route.params;

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getparcels = async () => {
            const token = await AsyncStorage.getItem("token");
            // console.log(item);
            if (!token) {
                console.log('Token is empty');
            } else {
                // console.log("heee");
                try {
                    const response = await axios.post('http://192.168.1.7:5000/parcel/parcelNumber', {
                        "parcelNumber": item
                    });
                    setParcelinfo(response.data.data);
                    setParceldevices(response.data.data.devices);
                    setParecelAccess(response.data.data.accessories);
                    // console.log(response.data.data,'parcels');
                    // console.log(response.data.data.accessories[0], "parcel Info");
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getparcels();
    }, []);



    const sendrevice = async (data) => {
        const token = await AsyncStorage.getItem("token");
        if (data) {
            if (token) {
                try {
                    const response = await axios.post('http://192.168.1.7:5000/parcel/updatestatus', {
                        "parcelNumber": data,
                        "status": "received"
                    });
                    // console.log(response.data,"recive");
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }

        const storedevice = async () => {
            const resposne = await axios.post(apiUrl + '/addagentstoredevice', {
                deviceids: parceldevices
            }, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            // console.log(resposne.data.message);
        }
        storedevice();

        const storeaccess = async () => {
            const response = await axios.post(apiUrl + '/addagentstoreaccess', {
                access: parcelAccess
            }, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            // console.log(response.data.message);
        }
        storeaccess();
        navigation.navigate('Parcels');
    }



    const renderItem = ({ item }) => (
        <View style={styles.deviceCard}>
            <Text>Device ID: {item}</Text>
        </View>
    );


    const renderAccessItem = ({ item }) => (
        <View style={styles.deviceCard}>
            <Text>Device ID: {item.id}</Text>
            <Text>Quantity : {item.quantity}</Text>
        </View>
    );


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Parcel Info</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
                {parcelinfo ? (
                    <View style={{ width: '100%', height: '98%', marginBottom: 20 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <Text style={styles.parcelIdText}>{parcelinfo.parcelNumber}</Text>

                            {/* <Text>Parcel Number : {parcelinfo.parcelNumber}</Text> */}

                            <View style={styles.parcelImageWrapper}>
                                <Image
                                    style={styles.parcelImage}
                                    source={{
                                        uri: 'https://th.bing.com/th/id/OIP.6n0gYZ_FOFWe3XZDGSutKQAAAA?w=178&h=170&c=7&r=0&o=5&pid=1.7',
                                    }}
                                />
                            </View>

                            <View style={styles.infoBlock}>
                                <Text style={styles.label}>Supporter:</Text>
                                <Text style={styles.value}>{parcelinfo.supportname}</Text>

                                <Text style={styles.label}>From</Text>
                                <Text style={styles.value}>{parcelinfo.pickupLocation}</Text>

                                <Text style={styles.label}>Destination Location:</Text>
                                <Text style={styles.value}>{parcelinfo.destination}</Text>
                            </View>

                            <View>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Devices</Text>
                                </View>
                                {parceldevices ? (
                                    <View>
                                        <FlatList
                                            data={parceldevices}
                                            renderItem={renderItem} />
                                    </View>
                                ) : (
                                    <View>
                                        <Text>No</Text>
                                    </View>
                                )}
                            </View>

                            <View>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Accessories</Text>
                                </View>
                                {parcelAccess ? (
                                    <View>
                                        <FlatList
                                            data={parcelAccess}
                                            renderItem={renderAccessItem} />
                                    </View>
                                ) : (
                                    <View>
                                        <Text>No</Text>
                                    </View>
                                )}
                            </View>
                            <TouchableOpacity style={styles.Button} onPress={() => sendrevice(parcelinfo.parcelNumber)}>
                                <Text style={styles.buttonText}>Get All</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                ) : (
                    <View>
                        <Text>No Parcels</Text>
                    </View>
                )}
                {/* <TouchableOpacity >
                    <Text></Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
    },

    parcelIdText: {
        marginTop: 10,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1c1c1e',
    },

    statusBadge: {
        alignSelf: 'center',
        backgroundColor: '#ffa500',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },

    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },

    parcelImageWrapper: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },

    parcelImage: {
        height: '100%',
        width: '100%',
    },

    infoBlock: {
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },

    value: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },

    sectionHeader: {
        marginVertical: 10,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },

    deviceCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },

    accessoryCard: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },

    accessoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },

    Button: {
        backgroundColor: '#309264',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        elevation: 3,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}
);

export default ParcelInfo;