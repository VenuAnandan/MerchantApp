import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const DamageParcels = ({ navigation }) => {

    const [damageparcel, setDamageparcel] = useState();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    useEffect(() => {
        const getpdamageparcels = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    const response = await axios.get(apiUrl + '/getpdamageparcels', {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    setDamageparcel(response.data.data);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getpdamageparcels();
    }, []);


    const renderAccessItem = ({ item }) => (
        <TouchableOpacity style={styles.notificationContainer} onPress={()=> navigation.navigate('GetParcel',{item:item.parcel_id})}>
            <View style={styles.textContainer}>
                <Text style={styles.notificationHeading}>Supporter Name : {item.suppname}</Text>
                {/* <Text style={styles.notificationText}>Quantity : {item.quantity}</Text> */}
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
                    <Text style={{ fontSize: 20, color: 'white' }}>Damage Parcels</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Deliverpage')}
                    style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center', flexWrap: 'wrap', backgroundColor: '#309264' }}>
                    <Text style={{color:'white'}}>Create Parcels</Text>
                </TouchableOpacity>
            </View>

            {damageparcel ? (
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={damageparcel}
                        renderItem={renderAccessItem} />
                </View>
            ) : (
                <View>
                    <Text>No</Text>
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
}
);

export default DamageParcels;