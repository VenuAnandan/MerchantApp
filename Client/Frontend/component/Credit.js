import React from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";

const Credit = ({navigation}) => {
    return (
        <View style={styles.conatiner} >
            <Text>Credite Score Informations Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    conatiner : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    }
}
);

export default Credit;