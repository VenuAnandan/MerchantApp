import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, Button, StatusBar, Platform, Image, TextInput, Pressable, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";

const Home = ({ navigation }) => {


    const data = "";
    const [agentname, setAgentname] = useState("Name");
    const [agentemail, setAgentemail] = useState("Email");
    const [score, setScore] = useState(0);
    const [incomplete, setIncomplete] = useState(0);
    const [kycpending, setKYCpending] = useState(0);
    const [ticketrise, setTicketrise] = useState(0);
    const [sto, setSto] = useState(0);
    const [search, setSearch] = useState('');

    const [message, setMessage] = useState();

    const [parcelsinfo, setParcelsinfo] = useState();

    const gosearch = () => {
        if (search === '' || search === null) {
            setMessage('error');
            showToast("Empty Search!");
        } else {
            setSearch('');
            navigation.navigate('SearchStore', { text: search });
        }
    }

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {

        // const getparcels = async () => {
            // try {
            //     const response = await axios.post('http://192.168.1.8:5000/parcel/agentid', {
            //         "agentid": "id_1742404536258"
            //     });
            //     setParcelsinfo(response.data.data);
            //     // console.log(response.data.data[4], "devicess");
            // } catch (error) {
            //     console.log(`EError is : ${error}`);
            // }
        // }
        // getparcels();


        const storeparcelsinfo = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                try {
                    // console.log(parcelsinfo,'stores')
                    const response = await axios.post(apiUrl + '/storeparcels', {
                        data: parcelsinfo
                    }, {
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    });
                    // console.log(response.data.message);
                } catch (error) {
                    console.log(`EError is : ${error}`);
                }
            }
        }

        storeparcelsinfo();


        const getimcomplet = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await axios.get(apiUrl + '/forhome', {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                setAgentname(response.data.fname);
                setAgentemail(response.data.email);
                setScore(response.data.score);
                setIncomplete(response.data.incomple);
                setKYCpending(response.data.pending);
                setSto(response.data.sto);
                setTicketrise(response.data.ticket);
            } catch (error) {
                console.log(`EError is : ${error}`);
            }
        }
        getimcomplet();
    }, []);



    const showToast = (data) => {
        if (message === 'error') {
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: data,
                position: 'top',
                visibilityTime: 3000
            });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F9F7F5' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Toast ref={(ref) => Toast.setRef(ref)} />
                <View style={styles.conatiner}>
                    <View style={styles.top1}>
                        <View style={styles.head1}>
                            <View style={styles.head12}>
                                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: '45%' }}>
                                    <Image style={styles.image} source={{ uri: 'https://img.icons8.com/?size=100&id=13042&format=png&color=000000' }} />
                                </TouchableOpacity>
                                <View>
                                    <Text style={{ fontSize: 25, color: 'white' }}>{agentname}</Text>
                                    <Text style={{ color: 'white' }}>{agentemail}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('AlertMess')}>
                                <Image style={styles.icon} source={{ uri: 'https://img.icons8.com/?size=100&id=17317&format=png&color=000000' }} />
                            </TouchableOpacity>
                        </View>
                        {/* <Text style={{fontSize:30, paddingTop:10}}>Welcome Budy</Text> */}
                        <View>
                            <TextInput style={styles.searchbar} value={search} onChangeText={setSearch} placeholder="Search Store Name"></TextInput>
                            {/* {!isvalid && <Text style={{ color: 'red' }}>Invalid input. Only alphabetic characters are allowed.</Text>} */}
                        </View>
                        <TouchableOpacity style={styles.edit} onPress={gosearch}>
                            <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Search</Text>
                        </TouchableOpacity>
                        {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
                    </View>
                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text style={{ fontSize: 22, fontStyle: 'italic' }}>Welcome! Unlock opportunities, connect, grow, and <Text style={{ color: '#309264' }}>achieve success</Text></Text>
                    </View>
                    <View style={styles.head3}>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('KYC')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=TqsKL58VfNRg&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>KYC Pending</Text>
                                <View style={styles.num}>
                                    <Text>{kycpending}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('MyStore')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=3itKcgt8xjuf&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>My Stores</Text>
                                <View style={styles.num}>
                                    <Text>{sto}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('Incomplete')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=otjWWu3EPnWv&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>Incomplete</Text>
                                <View style={styles.num}>
                                    <Text>{incomplete}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('Credit')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=KNxaH6cx0qhT&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>Credite Score</Text>
                                <View style={styles.num}>
                                    <Text>{score}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('TicketRise')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=x18yLpNPidhp&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>Ticket Rise</Text>
                                <View style={styles.num}>
                                    <Text>{ticketrise}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('Device')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=63961&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>Device</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('Parcels')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=j8Gul5fFFyJA&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>Parcels</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.head32} onPress={() => navigation.navigate('DamageParcels')}>
                            <View>
                                <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=T34j6RY0HsPA&format=png&color=000000' }}></Image>
                            </View>
                            <View>
                                <Text style={{ color: 'white' }}>Delivery</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.toastWrapper}>
                        <Toast />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        // flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
        // backgroundColor:'' #FCCC3A
    },
    edit: {
        backgroundColor: '#FCCC3A',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '50%',
        height: 40,
        shadowColor: 'black',
        elevation: 10
    },
    top1: {
        backgroundColor: '#309264',
        display: 'flex',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    head1: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: '95%',
    },
    head12: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    icon: {
        width: 35,
        height: 35
    },
    image2: {
        width: 50,
        height: 50,
    },
    searchbar: {
        width: 300,
        borderWidth: 1,
        margin: 20,
        height: 58,
        borderRadius: 15,
        padding: 20,
        backgroundColor: 'white'
    },
    head3: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        // backgroundColor:'red'
    },
    head31: {
        // borderWidth: 0.5,
        width: 160,
        height: 70,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        gap: 5,
        borderRadius: 20,
        backgroundColor: '#FF9555',
        shadowColor: 'black',
        elevation: 3
    },
    head32: {
        width: 160,
        height: 70,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        gap: 5,
        borderRadius: 20,
        backgroundColor: '#309264',
        shadowColor: 'black',
        elevation: 3,
        position: 'relative',
    },
    num: {
        position: 'absolute',
        marginTop: -20,
        marginLeft: 80,
        backgroundColor: '#FCCC3A',
        width: 20,
        height: 20,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        borderRadius: '50%'
    },
    head4: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    recent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingBottom: 20
    },
    store: {
        marginTop: 15,
        padding: 5,
        borderWidth: 0.2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 20
    },
    storess: {
        marginBottom: 5,
        // borderWidth: 0.5,
        display: 'flex',
        gap: 15,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'white',
        shadowColor: 'black',
        elevation: 3
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

export default Home;