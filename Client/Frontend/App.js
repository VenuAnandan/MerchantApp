import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import UserInfo from './component/UserInfo';
import Home from './component/Home';
import Login from './component/Login';
import Registration from './component/Registration';
import AddStore from './component/AddStore';
import Incomplete from './component/Incomplete';
import MyStore from './component/MyStore';
import StoreInfo from './component/StoreInfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



export default function App() {

  const [routetab, setRoutetab] = useState('Login');

  useEffect(() => {
    const checklogin = async () => {
      try {
        const loginstatus = await AsyncStorage.getItem("login");
        if (loginstatus === 'True') {
          setRoutetab('Home');
        } else {
          setRoutetab('Login')
        }
      } catch (error) {
        console.log(`Error is : ${error}`);
      }
    }
    checklogin();
  }, [])


  // function StackNavigator() {
  //   return (
  //     <Stack.Navigator initialRouteName={routetab}>
  //       <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
  //       <Stack.Screen name="UserInfo" component={UserInfo} options={{ headerShown: false }} />
  //       <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
  //       <Stack.Screen name='Mystore' component={MyStore} options={{ headerShown: false }} />
  //     </Stack.Navigator>
  //   );
  // }
  function AuthNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function UserInfoTab() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserInfo" component={UserInfo} />
        <Stack.Screen name="Incomplete" component={Incomplete} />
        <Stack.Screen name="MyStore" component={MyStore} />
      </Stack.Navigator>
    );
  }

  function TabNavigator() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="User" component={UserInfoTab} />
      </Tab.Navigator>
    );
  }


  return (
    <NavigationContainer>
      {routetab==="Home" ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}