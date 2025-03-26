import React, { useEffect } from "react";
import { View, Text, Button, StatusBar, Platform, Image, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserInfo = ({ navigation }) => {


    const agent = 'male';

    const goLogout = async () => {
        await AsyncStorage.removeItem("login");
        navigation.navigate('Login')
    }

    return (
        <View style={styles.conatiner}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Pressable style={styles.edit} onPress={() => navigation.navigate('User', { screen: 'EditProfile' })}>
                    <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Edit Profile</Text>
                </Pressable>
            </View>
            {(agent === 'male') ? (
                <View>
                    <Pressable style={styles.user2} onPress={() => navigation.navigate('User', { screen: 'AgentInfo' })}>
                        <Image style={{ width: 150, height: 150 }} source={{ uri: 'https://img.icons8.com/?size=100&id=Chgb7mhcx0Yj&format=png&color=000000' }}></Image>
                        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Men</Text>
                        <Text>men345@gmail.com</Text>
                    </Pressable>
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
            <View style={styles.user3}>
                <Pressable style={styles.user31} onPress={() => navigation.navigate('User', { screen: 'CompanyInfo' })}>
                    <View><Text style={{ fontWeight: 'bold', fontSize: 20 }}>My Company</Text></View>
                    <View><Text> @ </Text></View>
                </Pressable>
                <Pressable style={styles.user31} onPress={() => navigation.navigate('User', { screen: 'MyStore' })}>
                    <View><Text style={{ fontWeight: 'bold', fontSize: 20 }}>My Store</Text></View>
                    <View><Text> @ </Text></View>
                </Pressable>
                <Pressable style={styles.user31} onPress={() => navigation.navigate('User', { screen: 'Incomplete' })}>
                    <View><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Incomplete Stores</Text></View>
                    <View><Text> @ </Text></View>
                </Pressable>
            </View>
            <View style={styles.head3}>
                <Pressable style={styles.head31} onPress={() => navigation.navigate('Home', { screen: 'Credit' })}>
                    <View>
                        <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=KNxaH6cx0qhT&format=png&color=000000' }}></Image>
                    </View>
                    <View>
                        <Text>Credite Score</Text>
                        <Text>18/<Text style={{ fontWeight: 'bold' }}>50</Text></Text>
                    </View>
                </Pressable>
                <Pressable style={styles.head31} onPress={() => navigation.navigate('Home', { screen: 'Achivmentsinfo' })}>
                    <View>
                        <Image style={styles.image2} source={{ uri: 'https://img.icons8.com/?size=100&id=dG7fBLYuaXhj&format=png&color=000000' }}></Image>
                    </View>
                    <View>
                        <Text>Credite Score</Text>
                        <View>
                            <Text>Silver</Text>
                        </View>
                    </View>
                </Pressable>
            </View>
            <View>
                <Pressable style={styles.edit} onPress={goLogout}>
                    <Text style={{ color: 'white', marginTop: 7, marginBottom: 7, marginRight: 9, marginLeft: 9 }} >Logout</Text>
                </Pressable>
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
        justifyContent: 'center'
    },
    user2: {
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        flexWrap: 'wrap'
    },
    user3: {
        marginTop: 30,
        display: 'flex',
    },
    user31: {
        marginTop: 10,
        borderWidth: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        flexDirection: 'row',
        borderRadius: 20
    },
    image2: {
        width: 50,
        height: 50,
    },
    head3: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 15,
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
}
);

export default UserInfo;