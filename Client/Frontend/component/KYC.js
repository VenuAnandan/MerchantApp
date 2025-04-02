import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, TouchableOpacity, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FlatList } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const KYC = ({ navigation }) => {


    const [kycpending, setKycpending] = useState('');
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getmystore = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(apiUrl + '/pendingkyc', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                setKycpending(response.data);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
        }
        getmystore();
    }, []);


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Edit Store</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            <FlatList
                data={kycpending}
                keyExtractor={item => (item.id)}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => navigation.navigate('EditStore', { item: item })}>
                        <View style={styles.header}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: 'https://picsum.photos/100/100' }} />
                            <View>
                                <Text style={styles.title}>{item.storeName}</Text>
                                <Text style={styles.subtitle}>Owner: {item.ownerName}</Text>
                            </View>
                        </View>
                        <Image
                            style={styles.storeImage}
                            source={{ uri: 'https://picsum.photos/500/300' }} />

                        {item.Pending == 'No' ? (
                            <View style={{ backgroundColor: '' }}>
                                <Text></Text>
                            </View>
                        ) : (
                            <View style={{display:'flex', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
                                <View style={{ backgroundColor: 'red', width: '40%', padding: 5, marginTop: 7, display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 20, height: 40 }}>
                                    <Text style={{ color: 'white' }}>{item.Pending}</Text>
                                </View>
                            </View>
                        )}
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    storeImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
}
);

export default KYC;