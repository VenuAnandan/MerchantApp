import React from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, Image } from "react-native";

const StoreInfo = ({ route }) => {

    const { item } = route.params;

    return (
        <View style={styles.conatiner} >

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ display: 'flex', gap: 30, paddingTop: 60, padding: 30 }}>
                    <Image style={{ width: 300, height: 200 }} source={{ uri: 'https://picsum.photos/200/300' }} />
                    <View style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',flexDirection:'row'}}>
                        <View style={{display:'flex',flexWrap:'wrap',alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'column'}}>
                            <Text>Store Name : </Text>
                            <Text>Owner Name : </Text>
                            <Text>City : </Text>
                            <Text>Email : </Text>
                            <Text>Address : </Text>
                            <Text>Phone : </Text>
                            <Text>Status : </Text>
                        </View>
                        <View style={{display:'flex',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'flex-end',flexDirection:'column'}}>
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
            </ScrollView>
            {/* <Text>StoreInfo Screen </Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
}
);

export default StoreInfo;