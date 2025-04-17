import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";


const GetParcel = ({ navigation, route }) => {

    const { item } = route.params;

    const [parcelinformation, setParcelinformation] = useState();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getparcelnfo = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.post(apiUrl + '/getparcelinfo', {
                        parcel_id: item
                    }, {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    // console.log(response.data.data);
                    setParcelinformation(response.data.data);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getparcelnfo();
    }, []);

    const DeliveryDamage = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            try {
                // console.log(parcelsinfo,'stores')
                const response = await axios.post('http://192.168.1.48:5000/parcel/returnParcel', {
                    data: parcelinformation
                });
                console.log(response.data);
                if (response.data.message == 'success') {
                    showToast("success", `${response.data.message}`);
                }
            } catch (error) {
                console.log(`-EError is : ${error}`);
            }
        }
    }

    const showToast = (type, data) => {
        Toast.show({
            type: type,
            text1: type === 'error' ? 'Error!' : 'Success!',
            text2: data,
            position: 'top',
            visibilityTime: 3000
        });
    };


    return (
        <View style={styles.conatiner} >
            <View style={styles.toastWrapper}>
                <Toast />
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Parcel Informations</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>

            {parcelinformation ? (
                <View>
                    <Text style={{ marginTop: 10, fontSize: 40, margintBottom: 20 }}>{parcelinformation.parcel_id}</Text>
                    <View style={{ width: '70%', height: 270, borderRadius: 20 }}>
                        <Image style={{ height: '100%', width: '100%', borderRadius: 50 }} source={{ uri: 'https://th.bing.com/th/id/OIP.6-g1cpn6T7uZJsfG_-TcRwHaHa?w=176&h=180&c=7&r=0&o=5&pid=1.7' }} />
                    </View>
                    <View style={{ display: 'flex', width: '100%', padding: 5, marginTop: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ParcelUpdate', { parcel_id: parcelinformation.parcel_id })}>
                            <Text style={{ color: 'white' }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Button} onPress={DeliveryDamage}>
                            <Text style={{ color: 'white' }}>Deliver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }} />
                    <Text>No Stores</Text>
                </View>
            )
            }



        </View >
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
    Button: {
        backgroundColor: '#309264',
        width: '40%',
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignContent: 'center'
    },
    toastWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        elevation: 9999,
    }
}
);

export default GetParcel;