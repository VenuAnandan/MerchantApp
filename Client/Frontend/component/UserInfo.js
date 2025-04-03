import React, { useEffect, useState } from "react";
import { View, Text, Button, StatusBar, Platform, Image, Pressable, TouchableOpacity, InfoRow } from "react-native";
import { StyleSheet } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";

const UserInfo = ({ navigation, setIsLoggedIn }) => {
    // const navigation = useNavigation();
    const agent = 'male';

    const goLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }

    const [an, setAn] = useState('Agent Name');
    const [email, setEmail] = useState('email@gmail.com');
    const [ph, setPh] = useState('7993849293');
    const [add, setAdd] = useState('Some Address');
    const [dob, setDob] = useState('10-06-2025');
    const [scor, setScor] = useState('23');


    const apiUrl = process.env.EXPO_PUBLIC_API_URL;


    useEffect(() => {
        const getagentinfo = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(apiUrl + '/getagentinfo', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                setAn(response.data.fname);
                setEmail(response.data.email);
                setPh(response.data.phone);
                setAdd(response.data.address);
                setDob(response.data.dob);
                setScor(response.data.score);
                // console.log(response.data);
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        getagentinfo();
    }, [])



    return (
        <View style={styles.conatiner}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.edit} onPress={()=> navigation.navigate('EditProfile')}>
                    <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Edit Profile</Text>
                </TouchableOpacity>
            </View>
            {(agent === 'male') ? (
                <View>
                    <TouchableOpacity style={styles.user2}>
                        <Image style={{ width: 150, height: 150 }} source={{ uri: 'https://img.icons8.com/?size=100&id=Chgb7mhcx0Yj&format=png&color=000000' }}></Image>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{an}</Text>
                        <Text>{email}</Text>
                    </TouchableOpacity>
                    {/* <Text>UserInfo Screen</Text>s
                    <Button title="Home" onPress={() => { navigation.navigate('Home') }}></Button> */}
                </View>
            ) : (
                <View>
                    <View style={styles.user2}>
                        <Image style={{ width: 150, height: 150 }} source={{ uri: 'https://img.icons8.com/?size=100&id=0yCd8ocCXRy1&format=png&color=000000' }}></Image>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Women</Text>
                        <Text>women345@gmail.com</Text>
                    </View>
                </View>
            )}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Phone: {ph}</Text>
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Address: {add}</Text>
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>DOB: {dob}</Text>
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Score: {scor}</Text>
                </Text>
            </View>

            <View style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={styles.edit} onPress={goLogout}>
                    <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
        backgroundColor: '#F9F7F5'
    },
    edit: {
        backgroundColor: '#309264',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '30%',
        height: 40,
        shadowColor: 'black',
        elevation: 10
    },
    user2: {
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap'
    },
    image2: {
        width: 50,
        height: 50,
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },

}
);

export default UserInfo;