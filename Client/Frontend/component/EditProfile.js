import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { use, useEffect, useState } from "react";
import { View, Text, Button, Platform, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';


const EditProfile = ({ navigation }) => {

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [bg, setBg] = useState('');

    const [agentinfo, setAgentinfo] = useState();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        // console.log('---------------------------')
        const getagentinfo = async () => {
            const token = await AsyncStorage.getItem('token');
            // console.log('=');
            try {
                const resposne = await axios.get(apiUrl + '/getagentinfo', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                // console.log(resposne.data);
                setAgentinfo(resposne.data);
            } catch (error) {
                console.log(`Error is : ${error}`)
            }
        }
        getagentinfo();
    }, []);

    useEffect(() => {
        if (agentinfo) {
            setFname(agentinfo.fname || '');
            setLname(agentinfo.lname || '');
            setEmail(agentinfo.email || '');
            setPhone(agentinfo.phone || '');
            setAddress(agentinfo.address || '');
            setDob(agentinfo.dob || '');
            setGender(agentinfo.gender || '');
            setBg(agentinfo.bg || '')
        }
    }, [agentinfo])


    const editagentinfo = async () => {
        if (!fname || !lname || !email || !phone || !address || !dob || !bg) {
            console.log('Enter Important Data');
        } else {
            const token = await AsyncStorage.getItem("token");
            // console.log(bg);
            try {
                const response = await axios.post(apiUrl + '/editagentinfo', {
                    fname, lname, email, phone, address, dob, gender, bg
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                console.log(response.data.message);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
        }
    }

    return (

        <View style={styles.conatiner}>
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Edit Profile</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <TextInput placeholder="Enter First Name*" value={fname} onChangeText={setFname} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Last Name*" value={lname} onChangeText={setLname} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Email*" value={email} onChangeText={setEmail} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Phone Number*" value={phone} onChangeText={setPhone} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Address*" value={address} onChangeText={setAddress} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Date of Birth*" value={dob} onChangeText={setDob} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Gender" value={gender} onChangeText={setGender} style={styles.searchbar}></TextInput>
                    <TextInput placeholder="Enter Blood Group*" value={bg} onChangeText={setBg} style={styles.searchbar}></TextInput>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                    <TouchableOpacity style={styles.sign} onPress={editagentinfo}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* <View >
                <Text>Edit Screen</Text>
            </View> */}
        </View>

    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
    },
    searchbar: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 15,
        padding: 20,
    },
    sign: {
        backgroundColor: '#309264',
        borderRadius: 20,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
}
);

export default EditProfile;