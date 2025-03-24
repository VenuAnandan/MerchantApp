import React from "react";
import { View, Text, Button } from "react-native-web";
import { StyleSheet } from "react-native";

const StoreInfo = ({navigation}) => {
    return (
        <View style={styles.conatiner} >
            <Text>StoreInfo Screen</Text>
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

export default StoreInfo;