import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState, } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    Platform,
    FlatList,
    ScrollView,
} from "react-native";
import { StyleSheet, Alert, Button } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCameraPermissions, CameraView } from "expo-camera";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';



const ParcelUpdate = ({ navigation, route }) => {

    const [device, setdevice] = useState([]);
    const [model, setModel] = useState(false);

    const [devices, setdevices] = useState([]);
    const [charge, setCharge] = useState();
    const [battery, setBattery] = useState();
    const [audiocable, setAudiocable] = useState();
    const [messgaes, setMessages] = useState();
    const [supportinfo, setSupportinfo] = useState([]);
    const [suppid, setSuppid] = useState();
    const [suppname, setSuppname] = useState();
    const [pickloc, setPickloc] = useState();
    const [desloc, setdesloc] = useState();
    const [parcelid, setParcelid] = useState();
    const [devmess, setDevmess] = useState();


    const [scanned, setScanned] = useState(false);
    const [barcodeData, setBarcodeData] = useState('');
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    const cameraRef = useRef(null);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const [refreshKey, setRefreshKey] = useState(0);

    const { parcel_id } = route.params;

    useEffect(() => {
        const getsupportinfo = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    // console.log(parcelsinfo,'stores')
                    const response = await axios.get('http://192.168.1.48:5000/user/allSuportId', {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    setSupportinfo(response.data);
                    // console.log(response.data);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getsupportinfo();

        const getparccelinfo = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    // console.log(parcelsinfo,'stores')
                    const response = await axios.post(apiUrl + '/getparcelinfo', {
                        parcel_id: parcel_id
                    }, {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    const detail = response.data.data;
                    // console.log(response.data.data.devices);
                    // const getalldevices = detail.deviceid.map(item => item.devicedata);
                    const getalldevices = detail.devices
                    // console.log(getalldevices);
                    setdevice(getalldevices);
                    setAudiocable(detail.audiocable);
                    setBattery(detail.battery);
                    setCharge(detail.charge);
                    setdesloc(detail.desloc);
                    setMessages(detail.messgaes);
                    setPickloc(detail.pickloc);
                    setSuppid(detail.suppid);
                    setSuppname(detail.suppname);
                    setParcelid(detail.parcel_id);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }
        getparccelinfo();


    }, []);


    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    useEffect(() => {
        if (model) {
            setScanned(false);
        }
    }, [model]);


    const handlenamechange = (name) => {
        setSuppname(name);
        const selected = supportinfo.find(item => item.name === name);
        // console.log(selected);
        if (selected) {
            setSuppid(selected.supportid);
        } else {
            setSuppid('');
        }
    };

    const removeid = (item) => {
        device.splice(item, 1);
        setRefreshKey(prevKey => prevKey + 1);
    }

    const handleBarcodeScanned = (barcode) => {
        if (!scanned) {
            setScanned(true);

            const deviceid = barcode.data;
            const verifydevice = async () => {
                if (deviceid) {
                    const token = await AsyncStorage.getItem("token");
                    try {
                        const response = await axios.post(apiUrl + '/verifydeviceid', {
                            "deviceid": deviceid
                        }, {
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        });
                        if (response.data.message == 'Yes') {
                            setBarcodeData(barcode.data);

                            const finddevice = device.find((item) => item.devicedata == barcode.data);
                            // console.log(finddevice);
                            if (!finddevice) {
                                device.push({deviceid:barcode.data ,status :'damage',DamageMsg:devmess});     ///-------------------------------------------------
                                // device.push(barcode.data)
                                // console.log(device,'device');
                                showToast("success", `Added - ${barcode.data}`);
                            } else {
                                showToast("success", `Already Added - ${barcode.data}`);
                            }
                            setdevices(barcode.data);
                            // setModel(false);
                        } else {
                            showToast("error", `${barcode.data}`);
                        }
                    } catch (error) {
                        console.log(`EError is : ${error}`);
                    }
                }
            }
            verifydevice();
        }
    };

    if (!permission || !permission.granted) {
        return <Text>Requesting camera permissions...</Text>;
    }

    const OpenModel = () => {
        if (permission) {
            setModel(true);
        }
    };


    const sendparcel = async () => {

        const verifyAcces = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token || !devices || !charge || !battery || !audiocable || !suppid || !suppname || !pickloc || !desloc || !parcel_id) {
                showToast("error", `Data Not Found`);
            } else {
                try {
                    const response = await axios.post(apiUrl + '/updatepackdamage', {
                        devices: device, charge: parseInt(charge), battery: parseInt(battery), audiocable: parseInt(audiocable), messgaes: messgaes, suppid: suppid, suppname: suppname,
                        pickloc: pickloc, desloc: desloc, parcel_id: parcel_id
                    }, {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    // console.log(response.data);
                    if (response.data.messgaes == 'Parcel Updated') {
                        showToast("success", `${response.data.message}`);
                        // navigation.goBack();
                    } else {
                        showToast("error", `${response.data.message}`);
                    }
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }

        verifyAcces();
    }



    const showToast = (type, data) => {
        Toast.show({
            type: type,
            text1: type === 'error' ? 'Error!' : 'Success!',
            text2: data,
            position: 'top',
            visibilityTime: 3000
        });
    };


    const renderAccessItem = ({ item }) => (
        <View style={styles.notificationContainer}>
            <View style={{ flex: 1 }}>
                <Text style={styles.notificationHeading}>{item.deviceid}</Text>
            </View>
            <TouchableOpacity><Text style={{ color: 'white' }} onPress={() => removeid(item)}>X</Text></TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            <View style={styles.toastWrapper}>
                <Toast />
            </View>
            <Toast ref={(ref) => Toast.setRef(ref)} />

            <View style={styles.header}>
                <View style={styles.toastWrapper}>
                    <Toast />
                </View>
                <Toast ref={(ref) => Toast.setRef(ref)} />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Deliver</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    style={styles.iconButton}
                >
                    <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={OpenModel} style={styles.scanButton}>
                <Text style={{ color: "white" }}>Scanner</Text>
            </TouchableOpacity>
            <ScrollView>

                <View style={{ marginTop: 20 }}>
                    {/* <View style={styles.toastWrapper}>
                    <Toast />
                </View>
                <Toast ref={(ref) => Toast.setRef(ref)} /> */}
                    {/* <TextInput
                    placeholder="Support Id"
                    style={styles.input}
                    value={suppid}
                    onChangeText={setSuppid}   //suppid
                /> */}
                    <Picker
                        selectedValue={suppname}
                        onValueChange={(itemValue) => handlenamechange(itemValue)}
                    >
                        <Picker.Item label="-- Select --" value="" />
                        {supportinfo.length > 0 &&
                            supportinfo.map((item) => (
                                <Picker.Item key={item.supportid} label={item.name} value={item.name} />
                            ))
                        }
                    </Picker>

                    {suppid ? (
                        <Text style={{ marginTop: 20, marginBottom: 20 }}>
                            Selected Support ID: {suppid}
                        </Text>
                    ) : null}


                    <TextInput
                        placeholder="Support Name"
                        style={styles.input}
                        value={suppname}
                        onChangeText={setSuppname}    //suppname
                    />
                    <TextInput
                        placeholder="Device Ids"
                        keyboardType='numeric'
                        style={styles.input}
                        value={devices}
                        onChangeText={setdevices}
                    />
                    {/* {device ? ( */}
                    <View style={{ width: '100%', height: 150, borderWidth: 1, marginBottom: 10 }}>
                        <FlatList
                            data={device}
                            renderItem={renderAccessItem} />
                    </View>
                    {/* ):(
                        <View>
                            <Text>No Device</Text>
                        </View>
                    )} */}

                    <TextInput
                        placeholder="Charge Quantity"
                        keyboardType='numeric'
                        style={styles.input}
                        value={charge}
                        onChangeText={setCharge}
                    />
                    <TextInput
                        placeholder="Battery Quantity"
                        keyboardType='numeric'
                        style={styles.input}
                        value={battery}
                        onChangeText={setBattery}
                    />
                    <TextInput
                        placeholder="AudioCable Quantity"
                        keyboardType='numeric'
                        style={styles.input}
                        value={audiocable}
                        onChangeText={setAudiocable}
                    />
                    <TextInput
                        placeholder="Pickup Location"
                        style={styles.input}
                        value={pickloc}
                        onChangeText={setPickloc}   //pickloc
                    />
                    <TextInput
                        placeholder="Destination Location"
                        style={styles.input}
                        value={desloc}
                        onChangeText={setdesloc}    //des loc
                    />
                    <TextInput
                        placeholder="Any Message"
                        style={styles.input}
                        value={messgaes}
                        onChangeText={setMessages}
                    />
                    <TouchableOpacity style={styles.Button} onPress={sendparcel}>
                        <Text style={{ color: 'white' }}>Update Parcel</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <Modal transparent={true} animationType="fade" onRequestClose={() => setModel(false)} visible={model}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={{ color: "white" }}>Scanner</Text>
                            <TouchableOpacity onPress={() => setModel(false)}>
                                <Text style={{ color: "white" }}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput value={devmess} onChangeText={setDevmess} placeholder="Device Problem" />
                        <View style={styles.cameraWrapper}>

                            <CameraView
                                style={{ flex: 1 }}
                                facing={facing}
                                barcodeScannerSettings={{
                                    barcodeTypes: ['qr', 'ean13', 'code128'], // Customize this if needed
                                }}
                                onBarcodeScanned={handleBarcodeScanned}
                            >
                                {scanned && (
                                    <View style={styles.resultBox}>
                                        <Text style={styles.resultText}>Scanned ID: {barcodeData}</Text>
                                        <Button title="Scan Again" onPress={() => setScanned(false)} />
                                    </View>
                                )}
                            </CameraView>

                        </View>
                        {/* <Text style={styles.barcodeText}>{barcode}</Text> */}
                        <TouchableOpacity style={styles.getIdButton}>
                            <Text style={{ color: "white" }}>Get Id</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        padding: 20,
    },
    header: {
        width: "100%",
        backgroundColor: "#309264",
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 30,
        marginBottom: 20,
        zIndex: 0
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        color: "white",
    },
    scanButton: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#309264",
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        width: "90%",
        height: "70%",
        borderRadius: 10,
        overflow: "hidden",
    },
    modalHeader: {
        backgroundColor: "#309264",
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cameraWrapper: {
        width: "100%",
        height: "70%",
        backgroundColor: "black",
    },
    scanAgainButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "yellow",
        padding: 10,
        borderRadius: 10,
    },
    barcodeText: {
        textAlign: "center",
        marginVertical: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    getIdButton: {
        backgroundColor: "#309264",
        padding: 10,
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    toastWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        elevation: 9999,
    },
    Button: {
        backgroundColor: '#309264',
        width: '50%',
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignContent: 'center'
    },
    notificationContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // alignContent:'center',
        backgroundColor: '#333',
        padding: 15,
        width: '50%',
        height: 60,
        marginBottom: 5,
        borderRadius: 8,
        // borderColor: 'black',
        // elevation: 5,
        // borderRadius: 1
    },
    bellIcon: {
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    notificationHeading: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    notificationText: {
        color: '#ddd',
        fontSize: 14,
    },
});

export default ParcelUpdate;
