import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, Button, Platform } from "react-native";
import { StyleSheet } from "react-native";

const AlertMess = ({ navigation }) => {
    return (
        <View style={styles.conatiner} >
            <Text>Company Informations Screen</Text>
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