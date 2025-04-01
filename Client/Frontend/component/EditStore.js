import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Text, Button, Platform, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, Image } from "react-native";

const EditStore = ({ navigation, route }) => {

    const { item } = route.params;
    const [qrImage, setQrImage] = useState(item.qrCodeImage);

    // console.log(item);

    return (
        <View style={styles.conatiner} >

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ display: 'flex', gap: 30, paddingTop: 60, padding: 30 }}>
                    <Image style={{ width: 330, height: 200 }} source={{ uri: 'https://picsum.photos/200/300' }} />
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: 'row' }}>
                        <View style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                            <Text>Store Name : </Text>
                            <Text>Owner Name : </Text>
                            <Text>City : </Text>
                            <Text>Email : </Text>
                            <Text>Address : </Text>
                            <Text>Phone : </Text>
                            <Text>Status : </Text>
                        </View>
                        <View style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <Text>{item.storeName}</Text>
                            <Text>{item.ownerName}</Text>
                            <Text>{item.city}</Text>
                            <Text>{item.email}</Text>
                            <Text>{item.address}</Text>
                            <Text>{item.phone}</Text>
                            <Text>{item.status}</Text>
                        </View>
                    </View>
                </View>
                {qrImage && (
                    <View>
                        <View style={styles.qrContainer}>
                            <Text style={styles.qrText}>QR Code:</Text>
                            <Image source={{ uri: qrImage }} style={styles.qrImage} />
                        </View>
                    </View>
                )}
            </ScrollView>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, paddingBottom: 150 }}>
                <Pressable style={styles.sign} onPress={() => navigation.navigate('EditOrigin', { item: item })}>
                    <Text style={{ color: 'white', fontSize: 17 }}>Edit</Text>
                </Pressable>
            </View>
            {/* <Text>StoreInfo Screen </Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingTop: 30,
    }, sign: {
        backgroundColor: 'black',
        borderRadius: 20,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    qrContainer: {
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

export default EditStore;