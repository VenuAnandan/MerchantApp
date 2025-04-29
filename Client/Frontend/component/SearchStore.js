import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform, TouchableOpacity, Pressable, Image } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';


const SearchStore = ({ navigation, route }) => {

    const { text } = route.params;

    const [searchedstore, setSearchedstore] = useState();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const searchbarfunction = async () => {
            try {
                const resposne = await axios.post(apiUrl + '/searchstore', { storename: text });
                if (resposne.data == 'Store not found' || resposne.data == 'Empty store name') {
                    setSearchedstore('');
                } else {
                    setSearchedstore(resposne.data.data);
                }
                // console.log(resposne.data);
            } catch (error) {
                console.log(`Eerror is : ${error}`)
            }
        }
        searchbarfunction();
    }, [text, apiUrl]);

    return (


        <View style={styles.container} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Searched Store</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            {searchedstore ? (
                <View>
                    <Text style={{fontSize:17}}>You Are Searched : <Text style={{fontWeight:'bold', fontSize:20, fontStyle: 'italic'}}>{text}</Text></Text>
                    <FlatList
                        data={searchedstore}
                        keyExtractor={item => (item.id)}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.card}
                                onPress={() => navigation.navigate('StoreInfo', { item: item.id })}>
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
                </View>
            ) : (
                // https://img.icons8.com/?size=100&id=8rvKNd0gtsym&format=png&color=000000
                <View style={{ marginTop: '50%', display: 'flex', alignItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                    <Image
                        style={{ width: 200, height: 200 }}
                        source={{ uri: 'https://img.icons8.com/?size=100&id=lj7F2FvSJWce&format=png&color=000000' }} />
                    <Text>{text} not Founded</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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

export default SearchStore;