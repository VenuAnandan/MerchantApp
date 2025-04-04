import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, Pressable, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';


const MyStore = ({ navigation }) => {

    const [mystores, setMystores] = useState();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getmystore = async () => {
            const token = await AsyncStorage.getItem("token");
            // console.log(token, "-----");
            try {
                const response = await axios.get(apiUrl + '/mystores', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                setMystores(response.data);
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        getmystore();
    }, []);


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 30, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>My Stores</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <AntDesign name="close" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            {mystores ? (
                <FlatList
                    data={mystores}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.card}
                            onPress={() => navigation.navigate('StoreInfo', { item: item })}>
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
                        </Pressable>
                    )}
                />
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

export default MyStore;