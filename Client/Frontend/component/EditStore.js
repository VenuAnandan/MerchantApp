import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Text, Button, Platform, Pressable, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';


const EditStore = ({ navigation, route }) => {

    const { item } = route.params;
    const [qrImage, setQrImage] = useState(item.qrCodeImage);

    // console.log(item);

    return (
        <View style={styles.conatiner} >

            <View style={{ width: '100%', backgroundColor: '#309264', paddingTop: 10, paddingBottom: 10, borderRadius: 20, display: 'flex', marginTop: 30, marginBottom: 30, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </View>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 20, color: 'white' }}>Store Informations</Text>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View>
                        <AntDesign name="close" size={24} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-end', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Pressable style={styles.sign} onPress={() => navigation.navigate('EditOrigin', { item: item })}>
                        <Text style={{ color: 'white', fontSize: 17 }}>Edit</Text>
                    </Pressable>
                </View>
                <View style={styles.header}>
                    <Text style={styles.storeName}>{item.storeName} Store</Text>
                    <Image
                        style={styles.storeImage}
                        source={{ uri: 'https://picsum.photos/500/300' }}
                    />
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Store Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Owner:</Text>
                        <Text style={styles.value}>{item.ownerName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Contact:</Text>
                        <Text style={styles.value}>+91 {item.phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{item.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>City:</Text>
                        <Text style={styles.value}>{item.city}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Address:</Text>
                        <Text style={styles.value}>{item.address}</Text>
                    </View>
                </View>
                {qrImage && (
                    <View style={styles.qrContainer}>
                        <Text style={styles.qrText}>Scan QR Code:</Text>
                        <Image source={{ uri: qrImage }} style={styles.qrImage} />
                    </View>
                )}
            </ScrollView>
            {/* <Text>StoreInfo Screen </Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingTop: 20,
        backgroundColor: '#F9F7F5'
    },
    sign: {
        marginTop: 10,
        margintbottom: 10,
        backgroundColor: '#309264',
        borderRadius: 20,
        width: '40%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 20
    },
    storeName: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
    },
    storeImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
    },
    card: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 10,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    qrContainer: {
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    qrText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    qrImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    }
}
);

export default EditStore;