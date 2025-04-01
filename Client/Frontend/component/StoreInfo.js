import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, Text, Button, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, Image } from "react-native";

const StoreInfo = ({ route }) => {

    const { item } = route.params;
    const [qrImage, setQrImage] = useState(item.qrCodeImage);


    return (
        <View style={styles.conatiner} >
            <View style={{ width: '100%', display: 'flex', marginTop: 30, marginBottom: 30, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>
                <View style={{ backgroundColor: 'white', width: 50, height: 50, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><Text>back</Text></View>
                </View>
                <View style={{}}>
                    <Text style={{ fontSize: 20 }}>Store Informations</Text>
                </View>
                <View style={{ backgroundColor: 'white', width: 50, height: 50, borderRadius: '50%', display: 'flex', flexWrap: 'wrap', alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <View><Text>close</Text></View>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ display: 'flex', gap: 30, }}>
                    <Text style={{ fontSize: 30 }}>{item.storeName} Store</Text>
                    <View style={{display:'flex', flexWrap:'wrap', alignContent:'center'}}>
                        <Image style={{ width:'100%', height: 200 }} source={{ uri: 'https://picsum.photos/200/300' }} />
                    </View>
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
                    <Text>hello</Text>
                    {qrImage && (
                        <View>
                            <View style={styles.qrContainer}>
                                <Text style={styles.qrText}>QR Code:</Text>
                                <Image source={{ uri: qrImage }} style={styles.qrImage} />
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
            {/* <Text>StoreInfo Screen </Text> */}
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

export default StoreInfo;