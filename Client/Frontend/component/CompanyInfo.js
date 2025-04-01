import axios from "axios";
import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";

const CompanyInfo = ({navigation}) => {


    return (
        <View style={styles.conatiner} >
            <Text>Company Informations Screen</Text>
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

export default CompanyInfo;