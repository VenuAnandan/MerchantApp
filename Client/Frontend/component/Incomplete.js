import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Pressable, Image } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";

const Incomplete = ({ navigation }) => {


    const [incompletestores, setIncompletestores] = useState('');
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const getmystore = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(apiUrl + '/incompletestoreinfo', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                // console.log(apiUrl);
                // console.log(response.data);
                setIncompletestores(response.data);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
        }
        getmystore();
    }, []);



    return (
        <View style={styles.conatiner} >
            <View>
                <Text style={{ fontSize: 30, paddingTop: 20, paddingBottom: 20 }}>Incomplete Stores</Text>
            </View>
            <FlatList
                data={incompletestores}
                keyExtractor={item => (item.id)}
                renderItem={({ item }) => (
                    <Pressable style={styles.storess} onPress={() => navigation.navigate('Add', { screen: 'StoreInfo' })}>
                        <View>
                            <Image style={{ width: 100, height: 100, borderRadius: 15 }} source={{ uri: 'https://picsum.photos/200/300' }}></Image>
                        </View>
                        <View>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{item.storeName}</Text>
                            <Text >Owner : {item.ownerName}</Text>
                            <Text >Phone : {item.phone}</Text>
                            <Text >Status : {item.status}</Text>
                        </View>
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
        padding: 30
    },
    storess: {        
        marginTop:10,
        borderWidth: 0.5,
        display: 'flex',
        gap: 15,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 15
    }
}
);

export default Incomplete;