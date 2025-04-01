import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, Button, Platform, Image } from "react-native";
import { StyleSheet } from "react-native";

const AlertMess = ({ navigation }) => {
    return (
        <View style={styles.conatiner} >
            <Text>Company Informations Screen</Text>
            <View style={{display:'flex', flexWrap:'wrap'}}>
                <View>
                    <Image style={{ width: 100, height: 100 }} source={{ uri: 'https://img.icons8.com/?size=100&id=40401&format=png&color=000000' }}></Image>
                </View>
                <View>
                    <Text>Head</Text>
                    <Text>a JavaScript Date object you can use Date.valueOf() to get the milliseconds from the epoch of that time and then do plain subtraction to get the difference. If it is greater than 60000 then expire</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        padding: 30,
    }
}
);

export default AlertMess;