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
    const [search, setSearch] = useState('');

    const [message, setMessage] = useState();

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

    const [allstores, setAllstores] = useState();

    useEffect(() => {
        const getmystore = async () => {
            try {
                const response = await axios.get(apiUrl + '/allstores', {
                });
                setAllstores(response.data);
            } catch (error) {
                console.log(`EError is : ${error}`)
            }
        }
        getmystore();
    }, []);



    const showToast = (data) => {
        if(message === 'error'){
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: data
            });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.conatiner}>
                <View style={styles.head1}>
                    <View style={styles.head12}>
                        <TouchableOpacity>
                            <Image style={styles.image} source={{ uri: 'https://img.icons8.com/?size=100&id=13042&format=png&color=000000' }} />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ fontSize: 25 }}>{agentname}</Text>
                            <Text>{agentemail}</Text>
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
                <View style={styles.head3}>
                    <TouchableOpacity style={styles.head31} onPress={() => navigation.navigate('Credit')}>
                        <View>
                            <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=KNxaH6cx0qhT&format=png&color=000000' }}></Image>
                        </View>
                        <View>
                            <Text>Credite Score</Text>
                            <Text>18/<Text style={{ fontWeight: 'bold' }}>50</Text></Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.head31} onPress={() => navigation.navigate('Achivmentsinfo')}>
                        <View>
                            <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=dG7fBLYuaXhj&format=png&color=000000' }}></Image>
                        </View>
                        <View>
                            <Text>Achivements</Text>
                            <View>
                                <Text>Silver</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {data ? (
                    <View style={styles.head4}>
                        <View style={styles.recent}>
                            <View>
                                <Text>Recent Stores</Text>
                            </View>
                            <View>
                                <Text>View All</Text>
                            </View>
                        </View>
                        <View>
                            <View style={styles.store}>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                    <View>
                                        <Image style={{ width: 90, height: 70, borderRadius: 20 }} source={{ uri: 'https://picsum.photos/200/300' }} />
                                    </View>
                                    <View>
                                        <Text>Sri Rajalakshmi Saaman</Text>
                                        <Text>Chennai</Text>
                                        <Text>Contact : </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.head4}>
                        <View style={styles.recent}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recent Stores</Text>
                            </View>
                            <View>
                                <Text>View All</Text>
                            </View>
                        </View>
                        <View>
                            <FlatList style={{ marginBottom: 60 }}
                                data={allstores}  //data={allstores.slice(0, 3)}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.storess} onPress={() => navigation.navigate('StoreInfo', { item: item })}>
                                        {/* onPress={() => navigation.navigate('User', { screen: 'AgentInfo' })} */}
                                        <View>
                                            <Image style={{ width: 100, height: 100, borderRadius: 15 }} source={{ uri: 'https://picsum.photos/200/300' }}></Image>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{item.storeName}</Text>
                                            <Text >Owner : {item.ownerName}</Text>
                                            <Text >Phone : {item.phone}</Text>
                                            <Text >Status : {item.status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            {/* <Text style={{marginTop:0}}>See All</Text> */}
                            <Button title="toast" onPress={showToast}></Button>
                            <Toast ref={(ref) => Toast.setRef(ref)} />
                        </View>
                    </View>
                )};
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 30,
    },
    edit: {
        backgroundColor: 'black',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    head1: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    head12: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center'
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
        borderWidth: 1,
        margin: 20,
        borderRadius: 15,
        padding: 20
    },
    head3: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 5,
        marginBottom: 15
    },
    head31: {
        borderWidth: 0.5,
        width: 160,
        height: 70,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        gap: 5,
        borderRadius: 20,
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
        marginTop: 10,
        borderWidth: 0.5,
        display: 'flex',
        gap: 15,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 15,
    }

}
);

export default Home;