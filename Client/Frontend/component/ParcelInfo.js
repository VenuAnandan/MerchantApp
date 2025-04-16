import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity } from "react-native";
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
            if (!token) {
                console.log('Token is empty');
            } else {
                // console.log("heee");
                try {
                    const response = await axios.post('http://192.168.1.48:5000/parcel/parcelNumber', {
                        "parcelNumber": item
                    });
                    setParcelinfo(response.data.data);
                    setParceldevices(response.data.data.devices);
                    setParecelAccess(response.data.data.accessories);
                    console.log(response.data.data.accessories);
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
                    // const response = await axios.post('http://192.168.4.89:5000/parcel/updatestatus', {
                    //     "parcelNumber": data,
                    //     "status":"received"
                    // });
                    console.log(response.data,"recive");
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
            const response = await axios.post(apiUrl + '/addagentstoreaccess',{
                access : parcelAccess
            },{
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            // console.log(response.data.message);
        }
        storeaccess();
        navigation.navigate('Parcels');
    }



    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationContainer}>
            <Feather name="bell" size={24} color="black" />
            <View style={styles.textContainer}>
                <Text style={styles.notificationHeading}>{item}</Text>
            </View>
        </TouchableOpacity>
    );


    const renderAccessItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationContainer}>
            <Feather name="bell" size={24} color="black" />
            <View style={styles.textContainer}>
                <Text style={styles.notificationHeading}>{item.id}</Text>
                <Text style={styles.notificationText}>Quantity : {item.quantity}</Text>
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
                    <Text style={{ fontSize: 20, color: 'white' }}>Parcel Info</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            <View>
                {parcelinfo ? (
                    <View>
                        <Text>Parcel Number : {parcelinfo.parcelNumber}</Text>

                        <View>
                            <Text>Devices</Text>
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
                            <Text>Accessories</Text>
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
                        <TouchableOpacity style={{ borderWidth: 1, width: 90, padding: 5 }} onPress={() => sendrevice(parcelinfo.parcelNumber)}>
                            <Text>Received</Text>
                        </TouchableOpacity>
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

export default ParcelInfo;