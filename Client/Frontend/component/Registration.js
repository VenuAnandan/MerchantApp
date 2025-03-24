import React from "react";
import { View, Text, Button } from "react-native-web";
import { StyleSheet } from "react-native";

const Registration = ({navigation}) => {
    return (
        <View style={styles.conatiner} >
            <Text>Registration Screen</Text>
            <Button title="Home" onPress={()=>{navigation.navigate('home')}}></Button>
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

export default Registration;