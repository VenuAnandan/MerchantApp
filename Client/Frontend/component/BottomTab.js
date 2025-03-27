import React from "react";
import { View, Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./Home";
import Credit from "./Credit";
import Achivmentsinfo from "./Achivmentinfo";
import AddStore from "./AddStore";
import StoreInfo from "./StoreInfo";
import UserInfo from "./UserInfo";
import Incomplete from "./Incomplete";
import MyStore from "./MyStore";
import EditProfile from "./EditProfile";
import AgentInfo from "./AgentInfo";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const CompanyInfo = () => {

    function HomePage() {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Credit' component={Credit} />
                <Stack.Screen name='Achivmentsinfo' component={Achivmentsinfo} />
            </Stack.Navigator>
        )
    }

    function StorePage() {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='AddStore' component={AddStore} />
                <Stack.Screen name='StoreInfo' component={StoreInfo} />
            </Stack.Navigator>
        )
    }


    function UserInfoTab() {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="UserInfo" component={UserInfo} />
                <Stack.Screen name="Incomplete" component={Incomplete} />
                <Stack.Screen name="MyStore" component={MyStore} />
                <Stack.Screen name='CompanyInfo' component={CompanyInfo} />
                <Stack.Screen name='EditProfile' component={EditProfile} />
                <Stack.Screen name='AgentInfo' component={AgentInfo} />
            </Stack.Navigator>
        );
    }



    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name='Add' component={StorePage} />
            <Tab.Screen name="User" component={UserInfoTab} />
        </Tab.Navigator>
    );
}

export default CompanyInfo;