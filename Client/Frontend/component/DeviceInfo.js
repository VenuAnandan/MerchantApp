import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const DeviceInfo = ({ navigation, route }) => {

    const { item } = route.params;

    const [deviceinfo, setDeviceinfo] = useState();
    const [devicestatus, setDevicestatus] = useState();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getdevicedetails = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log('Token is empty');
            } else {
                try {
                    const response = await axios.post('http://192.168.4.64:5000/device/deviceid', {
                        "deviceid": item
                    });
                    setDeviceinfo(response.data);
                    setDevicestatus(response.data.device.status);
                    // console.log(response.data);
                    // console.log(response.data.device.status, '------');
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getdevicedetails();
    }, []);

    const deliverddevice = async () => {
        if (item) {
            try {
                try {
                    const response = await axios.post('http://192.168.4,64:5000/device/updatedevicestatus', {
                        deviceid: item,
                        status: "delivered"
                    });
                    console.log(response.data);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    try {
                        const resposne = await axios.post(apiUrl + '/devilveragentdevice', {
                            deviceid: item
                        }, {
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        });
                        if (resposne.data.message == 'Deliverd') {
                            navigation.navigate('Device');
                        }
                    } catch (error) {
                        console.log(`EError is : ${error}`);
                    }
                }
                navigation.navigate('Device');
            } catch (error) {
                console.log(`-EError is : ${error}`);
            }
        }
    }



    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Device Info</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            {deviceinfo ? (
                <View style={styles.card}>
                    <Image 
                    // source={{ uri: deviceinfo.device.image }} 
                    source={{ uri: 'https://th.bing.com/th/id/OIP.vscrkFtcXqYulbLGZUyh1wHaHa?pid=ImgDet&w=191&h=191&c=7' }}
                    style={styles.image} />

                    <View style={styles.infoContainer}>
                        <Text style={styles.deviceName}>{deviceinfo.device.devicename}</Text>

                        <View style={styles.row}>
                            {/* <Icon name="qr-code-outline" size={18} color="#666" /> */}
                            <Text style={styles.label}> Device ID: <Text style={styles.value}>{deviceinfo.device.deviceid}</Text></Text>
                        </View>

                        <View style={styles.row}>
                            {/* <Icon name="person-circle-outline" size={18} color="#666" /> */}
                            <Text style={styles.label}> Agent ID: <Text style={styles.value}>{deviceinfo.device.agentid}</Text></Text>
                        </View>

                        <View style={styles.row}>
                            {/* <Icon name="cube-outline" size={18} color="#666" /> */}
                            <Text style={styles.label}> Parcel: <Text style={styles.value}>{deviceinfo.device.parcelNumber}</Text></Text>
                        </View>

                        <View style={styles.row}>
                            {/* <Icon name="call-outline" size={18} color="#666" /> */}
                            <Text style={styles.label}> Support ID: <Text style={styles.value}>{deviceinfo.device.supportid}</Text></Text>
                        </View>

                        <View style={[styles.statusTag, deviceinfo.device.status === 'delivered' ? styles.statusDelivered : styles.statusPending]}>
                            <Text style={styles.statusText}>{deviceinfo.device.status.toUpperCase()}</Text>
                        </View>

                        {devicestatus === 'damaged' ? (
                            <Text style={styles.damaged}>
                                Device is Damaged (Verified by Supply Team)
                            </Text>
                        ) : (
                            <TouchableOpacity style={styles.assignButton} onPress={deliverddevice}>
                                <Text style={styles.assignText}>Assign Device</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

            ) : (
                <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }} />
                    <Text>No Devices Information</Text>
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
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 330,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 16,
    },
    deviceName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
    },
    value: {
        color: '#000',
        fontWeight: '500',
    },
    statusTag: {
        marginTop: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusDelivered: {
        backgroundColor: '#d4edda',
    },
    statusPending: {
        backgroundColor: '#fff3cd',
    },
    statusText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
    },
    damaged: {
        marginTop: 10,
        color: '#c82333',
        fontWeight: '600',
        fontSize: 14,
    },
    assignButton: {
        marginTop: 12,
        backgroundColor: '#309264',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    assignText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
}
);

export default DeviceInfo;