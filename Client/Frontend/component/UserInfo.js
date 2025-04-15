import React, { useEffect, useState } from "react";
import { View, Text, Button, StatusBar, Platform, Image, Pressable, TouchableOpacity, InfoRow, Modal, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const UserInfo = ({ navigation, setIsLoggedIn }) => {
    // const navigation = useNavigation();

    const [aldevice, setAldevice] = useState(0);
    const [alcharge, setAlcharge] = useState(0);
    const [albatt, setAllbatt] = useState(0);
    const [alaudio, setAlaudio] = useState(0);
    const agent = 'male';
    const [modalVisible, setModalVisible] = useState(false);
    const [numDevice, setNumDevice] = useState(0);
    const [numCharg, setNumCharg] = useState(0);
    const [numBatt, setNumBatt] = useState(0);
    const [numAudio, setNumAudio] = useState(0);

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
    const [agentid, setAgentid] = useState();


    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const sendrequest = async () => {
        if (numDevice || numCharg || numAudio || numBatt) {
            const requestItem = {"agent_id":agentid,"status":'Device & Accessories Request', "Number_of_device" : numDevice, "Charger":{"device_id":'AC-CH1742536643458',"quantity":parseInt(numCharg)},"AudioCable":{"device_id":"AC-ADC1742536643460","quantity":parseInt(numAudio)},"Battry":{"device_id":'AC-BTM1742536643461',"quantity":parseInt(numBatt)}}
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    console.log(requestItem);
                    // const response = await axios.post(apiUrl+'/itemsrequest',{
                    //     data : requestItem
                    // },{
                    //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    // });
                    showToast("success", `Run the code `);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }

            // showToast("success", `Run the code `);
        } else {
            showToast("error", `Data missing `);
            // console.log("");
        }
    }


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
                setAgentid(response.data.id);
                setAldevice(response.data.device);
                setAlcharge(response.data.charge);
                setAlaudio(response.data.audio);
                setAllbatt(response.data.battry);
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        getagentinfo();
    }, []);

    const showToast = (type, data) => {
        Toast.show({
            type: type,
            text1: type === 'error' ? 'Error!' : 'Success!',
            text2: data,
            position: 'top',
            visibilityTime: 3000
        });
    };


    return (
        <View style={styles.conatiner}>
            <View style={styles.toastWrapper}>
                <Toast />
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('EditProfile')}>
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
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: '10', backgroundColor: "#309264", display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', alignContent: 'center', borderRadius: '10%' }} >
                    <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Device request</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={styles.edit} onPress={goLogout}>
                    <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Logout</Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Already Stored</Text>

                        <Text style={styles.label}>Devices:{aldevice}</Text>
                        <Text style={styles.label}>Chargers:{alcharge}</Text>
                        <Text style={styles.label}>HDMI Cables:{alaudio}</Text>
                        <Text style={styles.label}>Batteries:{albatt}</Text>

                        <Text style={styles.subTitle}>Request Devices & Accessories</Text>

                        <TextInput style={styles.input} value={numDevice} onChangeText={setNumDevice} placeholder="Number of Devices" keyboardType="numeric" />
                        <TextInput style={styles.input} value={numCharg} onChangeText={setNumCharg} placeholder="Number of Chargers" keyboardType="numeric" />
                        <TextInput style={styles.input} value={numAudio} onChangeText={setNumAudio} placeholder="Number of HDMI Cables" keyboardType="numeric" />
                        <TextInput style={styles.input} value={numBatt} onChangeText={setNumBatt} placeholder="Number of Batteries" keyboardType="numeric" />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, styles.closeButton]}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={sendrequest} style={[styles.button, styles.sendButton]}>
                                <Text style={styles.buttonText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
        color: '#444',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: '#fafafa',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: '#888',
    },
    sendButton: {
        backgroundColor: '#007BFF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
}
);

export default UserInfo;