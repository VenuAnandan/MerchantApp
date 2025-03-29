import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from "react-native";

const SearchStore = ({ navigation, route }) => {

    const { text } = route.params;

    const [searchedstore, setSearchedstore] = useState();

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const searchbarfunction = async () => {
            try {
                const resposne = await axios.post(apiUrl + '/searchstore', { storename: text });
                setSearchedstore(resposne.data);
                console.log(resposne.data);
            } catch (error) {
                console.log(`Eerror is : ${error}`)
            }
        }
        searchbarfunction();
    }, [text, apiUrl]);

    return (

        
        <View style={styles.container} >
            {/* <Text>Company Informations Screen : {}</Text> */}
            {searchedstore ? (
                <FlatList
                data={searchedstore}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>Company name: {item.storeName}</Text>
                        <Text>Owner name: {item.ownerName}</Text>
                    </View>
                )}
            />
            ):(
                <Text>Company Informations Screen : {text} from not</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9c2ff',
        borderRadius: 5,
        width: '90%',
    }
}
);

export default SearchStore;