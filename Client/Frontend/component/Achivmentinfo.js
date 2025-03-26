import React from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";

const Achivmentsinfo = ({navigation}) => {
    return (
        <View style={styles.conatiner} >
            <Text>Achivments Information Screen</Text>
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

export default Achivmentsinfo;