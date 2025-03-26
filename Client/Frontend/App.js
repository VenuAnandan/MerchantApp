import { NavigationContainer, StackActions } from '@react-navigation/native';
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
import EditProfile from './component/EditProfile';
import CompanyInfo from './component/CompanyInfo';
import Credit from './component/Credit';
import Achivmentsinfo from './component/Achivmentinfo';
import AgentInfo from './component/AgentInfo';


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
        <Stack.Screen name='CompanyInfo' component={CompanyInfo}/>
        <Stack.Screen name='EditProfile' component={EditProfile}/>
        <Stack.Screen name='AgentInfo' component={AgentInfo}/>
      </Stack.Navigator>
    );
  }

  function HomePage(){
    return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Credit' component={Credit}/>
        <Stack.Screen name='Achivmentsinfo' component={Achivmentsinfo}/>
      </Stack.Navigator>
    )
  }

  function StorePage(){
    return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='AddStore' component={AddStore}/>
        <Stack.Screen name='StoreInfo' component={StoreInfo}/>
      </Stack.Navigator>
    )
  }


  function TabNavigator() {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name='Add' component={StorePage}/>
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