import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity, ScrollView } from "react-native";
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
                const response = await axios.post('http://192.168.1.7:5000/parcel/returnParcel', {
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

    const renderAccessory = (title, info) => (
        <View style={styles.accessoryCard}>
            <Text style={styles.accessoryTitle}>{title}</Text>
            <Text>ID: {info.id}</Text>
            <Text>Quantity: {info.quantity}</Text>
            <Text>Status: <Text style={{ color: info.status === 'damaged' ? 'red' : 'green' }}>{info.status}</Text></Text>
        </View>
    );


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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.parcelIdText}>{parcelinformation.parcel_id}</Text>

                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{parcelinformation.status}</Text>
                    </View>

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
                        <Text style={styles.value}>{parcelinformation.suppname}</Text>

                        <Text style={styles.label}>Pickup Location:</Text>
                        <Text style={styles.value}>{parcelinformation.pickloc}</Text>

                        <Text style={styles.label}>Destination Location:</Text>
                        <Text style={styles.value}>{parcelinformation.desloc}</Text>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Devices</Text>
                    </View>
                    {parcelinformation.devices.map((device, index) => (
                        <View key={index} style={styles.deviceCard}>
                            <Text>Device ID: {device.deviceid}</Text>
                            <Text>Status: <Text style={{ color: device.status === 'damaged' ? 'red' : 'green' }}>{device.status}</Text></Text>
                            <Text>Message: {device.DamageMsg}</Text>
                        </View>
                    ))}

                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Accessories</Text>
                    </View>

                    {renderAccessory('Battery', parcelinformation.batteryinfo)}
                    {renderAccessory('Audio Cable', parcelinformation.audioinfo)}
                    {renderAccessory('Charger', parcelinformation.chargerinfo)}

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.Button}
                            onPress={() =>
                                navigation.navigate('ParcelUpdate', {
                                    parcel_id: parcelinformation.parcel_id,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.Button} onPress={DeliveryDamage}>
                            <Text style={styles.buttonText}>Deliver</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        backgroundColor: '#007bff',
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