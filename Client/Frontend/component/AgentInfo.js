import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";

const AgentInfo = ({ navigation }) => {

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

    return (
        <>
            {agentinfo ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ display: 'flex', gap: 30, paddingTop: 60, padding: 30 }}>
                        <Image style={{ width: 300, height: 200 }} source={{ uri: 'https://picsum.photos/200/300' }} />
                        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: 'row' }}>
                            <View style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                                <Text>First Name : </Text>
                                <Text>Last Name : </Text>
                                <Text>Date of Birth : </Text>
                                <Text>Email : </Text>
                                <Text>Address : </Text>
                                <Text>Phone : </Text>
                                <Text>Status : </Text>
                            </View>
                            <View style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                <Text>{agentinfo.fname}</Text>
                                <Text>{agentinfo.lname}</Text>
                                <Text>{agentinfo.dob}</Text>
                                <Text>{agentinfo.email}</Text>
                                <Text>{agentinfo.address}</Text>
                                <Text>{agentinfo.phone}</Text>
                                <Text>{agentinfo.score}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.conatiner} >
                    <Text>Agent Informations Screen</Text>
                </View>
            )}
        </>
        // <View style={styles.conatiner} >
        //     <Text>Agent Informations Screen:{agentinfo.fname}</Text>
        // </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 30,
    }
}
);

export default AgentInfo;