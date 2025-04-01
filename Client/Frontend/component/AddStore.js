import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { use, useEffect, useState } from "react";
import { View, Text, Button, Platform, Pressable, Image } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import Toast from "react-native-toast-message";

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
            type: type,   // 'success', 'error', 'info'
            text1: type === 'error' ? 'Error!' : 'Success!',
            text2: data
        });
    };

    const addstoreinfo = async () => {
        if (!storeName || !phone || !email || !city || !ownerName) {
            // console.log('Enter Important Data');
            showToast("error", "Empty Fields! Please fill all required data.");
        } else {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.post(apiUrl + '/addstoreinfo', {
                    storeName, ownerName, email, address, address2, city, postalcode, phone
                    , GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                // console.log(response.data.message);
                // setQrImage(response.data.qrCodeImage);
                showToast("success", `${response.data.message}`);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
            setFlag('2');
        }
    }

    const addpaninfo = async () => {
        if (!pancardNo || !aadharcardNo) {
            showToast("error", "Empty Fields! Please fill all required data.");
        } else {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.post(apiUrl + '/addstoreinfo', {
                    storeName, ownerName, email, address, address2, city, postalcode, phone
                    , GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                // console.log(response.data.message);
                // setQrImage(response.data.qrCodeImage);
                showToast("success", `${response.data.message}`);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
            setFlag('3');
        }
    }

    const Addstore = async () => {
        if (!storeName || !ownerName || !phone || !email || !city || !pancardNo || !aadharcardNo || !accountNo) {
            showToast("error", "Empty Fields! Please fill all required data.");
        } else {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.post(apiUrl + '/addstoreinfo', {
                    storeName, ownerName, email, address, address2, city, postalcode, phone
                    , GSTno, storeType, pancardNo, aadharcardNo, bankName, accountNo, IFSCCode
                }, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                console.log(response.data.message);
                setStoreName(''); setOwnerName(''); setEmail(''); setAddress(''); setAddress2('');
                setCity(''); setPostalcode(''); setPhone(''); setGSTno(''); setStoreType('');
                setPancardNo(''); setAadharcardNo(''); setBankName(''); setAccountNo('');
                setIFSCCode('');
                // setQrImage(response.data.qrCodeImage);
                showToast("success", `${response.data.message}`);
                setFlag('1');
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
        }
    }


    return (
        <View style={styles.conatiner} >
            <Toast ref={(ref) => Toast.setRef(ref)} />

            <View>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 30 }}>
                    <Text style={{ fontSize: 30 }}>Create Account Now!</Text>
                </View>
            </View>

            <View>
                <View style={{ paddingTop: 10, display: 'flex', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                    <Pressable style={[{ padding: 10, backgroundColor: (flag >= '1' ? 'green' : 'red'), borderRadius: 5 }]}
                    // onPress={() => {
                    //     if (flag <= flag) {
                    //         setFlag('1');
                    //     }
                    // }}
                    >
                        <Text>Store Info</Text>
                    </Pressable>
                    <Pressable style={[{ padding: 10, backgroundColor: (flag >= '2' ? 'green' : 'red'), borderRadius: 5 }]}
                    // onPress={() => {
                    //     if (flag <= flag) {
                    //         setFlag('2');
                    //     }
                    // }}
                    >
                        <Text>Pan Info</Text>
                    </Pressable>
                    <Pressable style={[{ padding: 10, backgroundColor: (flag >= '3' ? 'green' : 'red'), borderRadius: 5 }]}
                    // onPress={() => {
                    //     if (flag <= flag) {
                    //         setFlag('3');
                    //     }
                    // }}
                    >
                        <Text>Bank Info</Text>
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
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
                                        <Text style={{ color: 'white', fontSize: 17 }}>Next</Text>
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
                                        <Text style={{ color: 'white', fontSize: 17 }}>Next</Text>
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
                                        <Text style={{ color: 'white', fontSize: 17 }}>Finish</Text>
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
                </ScrollView>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 30,
    },
    searchbar: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 20
    }, sign: {
        backgroundColor: 'black',
        borderRadius: 20,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
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
    }
}
);

export default AddStore;