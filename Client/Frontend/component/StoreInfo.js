import React from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";

const StoreInfo = ({ navigation }) => {
    return (
        <View style={styles.conatiner} >
            <Text>StoreInfo Screen</Text>
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