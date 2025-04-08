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

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getdevicedetails = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log('Token is empty');
            } else {
                try {
                    const response = await axios.post('http://192.168.4.89:5000/device/deviceid', {
                        "deviceid": item
                    });
                    setDeviceinfo(response.data);
                    // console.log(response.data, '------');
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
                const response = await axios.post('http://192.168.4.89:5000/device/updatedevicestatus', {
                    deviceid: item,
                    status: "delivered"
                });
                // console.log(response.data.message);
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    try {
                        const resposne = await axios.post(apiUrl + '/removeagentdevice',{
                            deviceid : item
                        }, {
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        });
                    } catch (error) {
                        console.log(`EError is : ${error}`);
                    }
                }

                navigation.navigate('Device');
            } catch (error) {
                console.log(`EError is : ${error}`);
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
                <View>
                    <Text>{deviceinfo.device.status}</Text>
                    <Text>{deviceinfo.device.supportid}</Text>
                    <TouchableOpacity style={{ borderWidth: 1, padding: 5 }} onPress={deliverddevice}>
                        <Text>Delivered</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text>Innternet issues</Text>
                </View>
            )}
            {/* <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}/> */}

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

export default DeviceInfo;