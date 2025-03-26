import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, Image, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";

const MyStore = ({ navigation }) => {

    const [mystores, setMystores] = useState();

    useEffect(() => {
        const getmystore = async () => {
            const id = "id_1742404536258";
            try {
                const response = await axios.post('http://192.168.1.37:4000/mystores', {
                    id
                });
                setMystores(response.data);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
        }
        getmystore();
    }, []);


    return (
        <View style={styles.conatiner} >
            <View>
                <Text style={{ fontSize: 40, paddingTop: 20, paddingBottom:20}}>My Stores</Text>
            </View>
            <FlatList
                data={mystores}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable style={styles.storess}>
                        <View>
                            <Image style={{ width: 100, height: 100, borderRadius:15}} source={{ uri: 'https://picsum.photos/200/300' }}></Image>
                        </View>
                        <View>
                            <Text style={{fontSize:25, fontWeight:'bold'}}>{item.storeName}</Text>
                            <Text >Owner : {item.ownerName}</Text>
                            <Text >City : {item.city}</Text>
                            <Text >Phone : {item.phone}</Text>
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
        padding: 30,
    },
    storess : {
        borderWidth:1,
        display:'flex',
        gap:15,
        flexWrap:'wrap',
        flexDirection:'row',
        padding:10,
        borderRadius:15
    }
}
);

export default MyStore;