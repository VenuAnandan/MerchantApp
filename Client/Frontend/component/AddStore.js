import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { use, useEffect, useState } from "react";
import { View, Text, Button, Platform, Pressable, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import Toast from "react-native-toast-message";
import AntDesign from '@expo/vector-icons/AntDesign';

const AddStore = ({ navigation }) => {

    const [storeName, setStoreName] = useState('');
    const [errsn, setErrorst] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [postalcode, setPostalcode] = useState('');
    const [phone, setPhone] = useState('');
    const [GSTno, setGSTno] = useState('');
    const [storeType, setStoreType] = useState('');
    const [pancardNo, setPancardNo] = useState('');
    const [aadharcardNo, setAadharcardNo] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [IFSCCode, setIFSCCode] = useState('');
    const [flag, setFlag] = useState('1');
    const [subFlag, setSubFlag] = useState('1');

    // const [qrImage, setQrImage] = useState(null);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const showToast = (type, data) => {
        Toast.show({
            type: type,
            text1: type === 'error' ? 'Error!' : 'Success!',
            text2: data,
            position: 'top',
            visibilityTime: 3000
        });
    };

    // const addstoreinfo = async () => {
    //     if (!storeName || !phone || !email || !city || !ownerName) {
    //         showToast("error", "Empty Fields! Please fill all required data.");
    //     } else {
    //         const token = await AsyncStorage.getItem("token");
    //         try {
    //             const response = await axios.post(apiUrl + '/addstoreinfo', {
    //                 storeName, ownerName, email, address, address2, city, postalcode, phone
    //                 , GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
    //             }, {
    //                 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //             });
    //             showToast("success", `${response.data.message}`);
    //         } catch (error) {
    //             console.log(`EError is : ${error}`)
    //         }
    //         setFlag('2');
    //     }
    // }
    const addstoreinfo = async () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9]{10}$/;
        const postalcodePattern = /^[0-9]{6}$/;

        if (!storeName || !phone || !email || !city || !ownerName) {
            showToast("error", "Empty Fields! Please fill all required data.");
            resetInvalidFields(storeName, phone, email, city, ownerName);
        } else if (!email.match(emailPattern)) {
            showToast("error", "Invalid Email Format.");
            setEmail('');
        } else if (!phone.match(phonePattern)) {
            showToast("error", "Invalid Phone Number.");
            setPhone('');
        } else if (!city) {
            showToast("error", "City is required.");
            setCity('');
        } else if (postalcode && !postalcode.match(postalcodePattern)) {
            showToast("error", "Invalid Postal Code.");
            setPostalcode('');
        } else {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.post(apiUrl + '/addstoreinfo', {
                    storeName, ownerName, email, address, address2, city, postalcode, phone,
                    GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                showToast("success", `${response.data.message}`);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            setFlag('2');
        }
    };

    // const addpaninfo = async () => {
    //     if (!pancardNo || !aadharcardNo) {
    //         showToast("error", "Empty Fields! Please fill all required data.");
    //     } else {
    //         const token = await AsyncStorage.getItem("token");
    //         try {
    //             const response = await axios.post(apiUrl + '/addstoreinfo', {
    //                 storeName, ownerName, email, address, address2, city, postalcode, phone
    //                 , GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
    //             }, {
    //                 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //             });
    //             showToast("success", `${response.data.message}`);
    //         } catch (error) {
    //             console.log(`EError is : ${error}`)
    //         }
    //         setFlag('3');
    //     }
    // }
    const addpaninfo = async () => {
        const pancardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const aadharcardPattern = /^[2-9]{1}[0-9]{11}$/;

        if (!pancardNo || !aadharcardNo) {
            showToast("error", "Empty Fields! Please fill all required data.");
            resetInvalidFields(pancardNo, aadharcardNo);
        } else if (!pancardNo.match(pancardPattern)) {
            showToast("error", "Invalid PAN Card Number.");
            setPancardNo('');
        } else if (!aadharcardNo.match(aadharcardPattern)) {
            showToast("error", "Invalid Aadhar Card Number.");
            setAadharcardNo('');
        } else {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.post(apiUrl + '/addstoreinfo', {
                    storeName, ownerName, email, address, address2, city, postalcode, phone,
                    GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                showToast("success", `${response.data.message}`);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            setFlag('3');
        }
    };


    // const Addstore = async () => {
    //     if (!storeName || !ownerName || !phone || !email || !city || !pancardNo || !aadharcardNo || !accountNo) {
    //         showToast("error", "Empty Fields! Please fill all required data.");
    //     } else {
    //         const token = await AsyncStorage.getItem("token");
    //         try {
    //             const response = await axios.post(apiUrl + '/addstoreinfo', {
    //                 storeName, ownerName, email, address, address2, city, postalcode, phone
    //                 , GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
    //             }, {
    //                 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //             });
    //             console.log(response.data.message);
    //             setStoreName(''); setOwnerName(''); setEmail(''); setAddress(''); setAddress2('');
    //             setCity(''); setPostalcode(''); setPhone(''); setGSTno(''); setStoreType('');
    //             setPancardNo(''); setAadharcardNo(''); setBankName(''); setAccountNo('');
    //             setIFSCCode('');
    //             showToast("success", `${response.data.message}`);
    //             setFlag('1');
    //             navigation.navigate('Home', { screen: 'Home' });
    //         } catch (error) {
    //             console.log(`EError is : ${error}`)
    //         }
    //     }
    // }
    const Addstore = async () => {
        const accountNoPattern = /^[0-9]{9,18}$/;

        if (!storeName || !ownerName || !phone || !email || !city || !pancardNo || !aadharcardNo || !accountNo) {
            showToast("error", "Empty Fields! Please fill all required data.");
        } else if (!accountNo.match(accountNoPattern)) {
            showToast("error", "Invalid Account Number. It should be numeric and between 9-18 digits.");
            setAccountNo('');
        } else {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.post(apiUrl + '/addstoreinfo', {
                    storeName, ownerName, email, address, address2, city, postalcode, phone,
                    GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                console.log(response.data.message);
                setStoreName(''); setOwnerName(''); setEmail(''); setAddress(''); setAddress2('');
                setCity(''); setPostalcode(''); setPhone(''); setGSTno(''); setStoreType('');
                setPancardNo(''); setAadharcardNo(''); setBankName(''); setAccountNo('');
                setIFSCCode('');
                showToast("success", `${response.data.message}`);
                setFlag('1');
                navigation.navigate('Home', { screen: 'Home' });
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        }
    };


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="arrowleft" size={24} color="white" /></View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Create Account</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><AntDesign name="close" size={24} color="white" /></View>
                </TouchableOpacity>
            </View>
            {/* <View>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 30 }}>
                    <Text style={{ fontSize: 30 }}>Create Account Now!</Text>
                </View>
            </View> */}
            <View>
                <View style={styles.containers}>
                    <Pressable
                        style={[
                            styles.button,
                            { backgroundColor: flag >= '1' ? '#27AE60' : '#BDC3C7', borderColor: flag === '1' ? '#2ECC71' : '#7F8C8D' },
                        ]}>
                        <Text style={[styles.text, { color: flag >= '1' ? '#FFF' : '#333' }]}>Store Info</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.button,
                            { backgroundColor: flag >= '2' ? '#2980B9' : '#BDC3C7', borderColor: flag === '2' ? '#3498DB' : '#7F8C8D' },
                        ]}>
                        <Text style={[styles.text, { color: flag >= '2' ? '#FFF' : '#333' }]}>Pan Info</Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.button,
                            { backgroundColor: flag >= '3' ? '#E67E22' : '#BDC3C7', borderColor: flag === '3' ? '#D35400' : '#7F8C8D' },
                        ]}>
                        <Text style={[styles.text, { color: flag >= '3' ? '#FFF' : '#333' }]}>Bank Info</Text>
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                    <View style={{ display: 'flex', gap: 30, padding: 20 }}>

                        {flag < '2' ? (
                            <>
                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Store Name*"
                                    value={storeName}
                                    onChangeText={setStoreName}
                                />
                                {/* {errsn ? <Text style={{ color: 'red' }}>{errsn}</Text> : null} */}

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Owner Name*"
                                    value={ownerName}
                                    onChangeText={setOwnerName}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Email*"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Address"
                                    value={address}
                                    onChangeText={setAddress}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Address Line 2"
                                    value={address2}
                                    onChangeText={setAddress2}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="City*"
                                    value={city}
                                    onChangeText={setCity}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Postal Code"
                                    value={postalcode}
                                    onChangeText={setPostalcode}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Phone*"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="GST No"
                                    value={GSTno}
                                    onChangeText={setGSTno}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Store Type"
                                    value={storeType}
                                    onChangeText={setStoreType}
                                />
                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingBottom: 150 }}>
                                    <Pressable style={styles.sign} onPress={addstoreinfo}>
                                        <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }}>Next</Text>
                                    </Pressable>
                                </View>
                            </>
                        ) : flag < '3' ? (
                            <>
                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="PAN Card No*"
                                    value={pancardNo}
                                    onChangeText={setPancardNo}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Aadhar Card No*"
                                    value={aadharcardNo}
                                    onChangeText={setAadharcardNo}
                                    keyboardType="numeric"
                                />
                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingBottom: 150 }}>
                                    <Pressable style={styles.sign} onPress={addpaninfo}>
                                        <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }}>Next</Text>
                                    </Pressable>
                                </View>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Bank Name"
                                    value={bankName}
                                    onChangeText={setBankName}
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="Account No*"
                                    value={accountNo}
                                    onChangeText={setAccountNo}
                                    keyboardType="numeric"
                                />

                                <TextInput
                                    style={styles.searchbar}
                                    placeholder="IFSC Code"
                                    value={IFSCCode}
                                    onChangeText={setIFSCCode}
                                />
                                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingBottom: 150 }}>
                                    {/* <Pressable style={styles.sign} onPress={handleGenerateQR}>
                                        <Text style={{ color: 'white', fontSize: 17 }}>Next</Text>
                                    </Pressable> */}
                                    <Pressable style={styles.sign} onPress={Addstore}>
                                        <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }}>Finish</Text>
                                    </Pressable>
                                    {/* {qrImage && (
                                        <View style={{ paddingBottom: 60 }}>
                                            <View style={styles.qrContainer}>
                                                <Text style={styles.qrText}>QR Code:</Text>
                                                <Image source={{ uri: qrImage }} style={styles.qrImage} />
                                            </View>
                                            <Pressable style={styles.sign} onPress={() => navigation.navigate('Home', { screen: 'Home' })}>
                                                <Text style={{ color: 'white', fontSize: 17 }}>Go Home</Text>
                                            </Pressable>
                                        </View>
                                    )} */}
                                </View>
                            </>
                        )}
                    </View>
                    <View style={styles.toastWrapper}>
                        <Toast />
                    </View>
                </ScrollView>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
    },
    containers: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 12,
    },
    searchbar: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 20
    }, sign: {
        backgroundColor: '#309264',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '50%',
        height: 40,
    }, storebutton: {
        borderWidth: 1, width: 100, padding: 10, display: 'flex', alignItems: 'center'
    }, qrContainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    qrText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    qrImage: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    toastWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        elevation: 9999,
    }
}
);

export default AddStore;