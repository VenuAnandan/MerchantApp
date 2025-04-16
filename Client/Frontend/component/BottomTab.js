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
import { MaterialIcons } from "@expo/vector-icons";
import EditStore from "./EditStore";
import AlertMess from "./AlertMess";
import { SearchBar } from "react-native-screens";
import SearchStore from "./SearchStore";
import EditOrigin from "./EditOrigin";
import KYC from './KYC';
import TicketRise from "./TicketRise";
import ChatPage from "./ChatPage";
import Device from "./Device";
import DeviceInfo from "./DeviceInfo";
import Parcels from "./Parcels";
import ParcelInfo from "./ParcelInfo";
import Deliverpage from "./Deliverpage";
import Scan from "./Scan";
import DamageParcels from "./DamageParcels";
import GetParcel from "./GetParcel";
import ParcelUpdate from "./ParcelUpdate";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const CompanyInfo = ({ setIsLoggedIn }) => {

  function HomePage({ setIsLoggedIn }) {
    return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Credit' component={Credit} />
        <Stack.Screen name='Achivmentsinfo' component={Achivmentsinfo} />
        <Stack.Screen name='StoreInfo' component={StoreInfo} />
        <Stack.Screen name='AlertMess' component={AlertMess} />
        <Stack.Screen name="SearchStore" component={SearchStore} />
        <Stack.Screen name="Incomplete" component={Incomplete} />
        <Stack.Screen name="MyStore" component={MyStore} />
        <Stack.Screen name="CompanyInfo" component={CompanyInfo} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='AgentInfo' component={AgentInfo} />
        <Stack.Screen name='EditStore' component={EditStore} />
        <Stack.Screen name='EditOrigin' component={EditOrigin} />
        <Stack.Screen name="TicketRise" component={TicketRise} />
        <Stack.Screen name="KYC" component={KYC} />
        <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen name="Device" component={Device} />
        <Stack.Screen name="DeviceInfo" component={DeviceInfo}/>
        <Stack.Screen name="Parcels" component={Parcels}/>
        <Stack.Screen name="ParcelInfo" component={ParcelInfo}/>
        <Stack.Screen name="Deliverpage" component={Deliverpage}/>
        <Stack.Screen name="Scan" component={Scan}/>
        <Stack.Screen name='DamageParcels' component={DamageParcels}/>   
        <Stack.Screen name="GetParcel" component={GetParcel}/>
        <Stack.Screen name="ParcelUpdate" component={ParcelUpdate} />
        <Stack.Screen name='AddStore' component={AddStore} />
        <Stack.Screen name="UserInfo">
          {({ navigation }) => <UserInfo setIsLoggedIn={setIsLoggedIn} navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  // function StorePage() {
  //   return (
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       <Stack.Screen name='AddStore' component={AddStore} />
  //     </Stack.Navigator>
  //   )
  // }


  // const UserInfoTab = ({ setIsLoggedIn }) => {
  //   return (
  //     <Stack.Navigator screenOptions={{ headerShown: false }}>
  //       <Stack.Screen name="UserInfo">
  //         {({ navigation }) => <UserInfo setIsLoggedIn={setIsLoggedIn} navigation={navigation} />}
  //       </Stack.Screen>
  //       <Stack.Screen name='EditProfile' component={EditProfile} />
  //     </Stack.Navigator>
  //   );
  // };


  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {()=> <HomePage setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
    </Stack.Navigator>


    // <Tab.Navigator
    //   screenOptions={({ route }) => ({
    //     headerShown: false,
    //     tabBarIcon: ({ color, size }) => {
    //       let iconName;

    //       // Assign icons for each tab
    //       if (route.name === 'Home') {
    //         iconName = 'home';
    //       } else if (route.name === 'Add') {
    //         iconName = 'add-circle-outline';
    //       } else if (route.name === 'User') {
    //         iconName = 'person';
    //       }

    //       return <MaterialIcons name={iconName} size={size} color={color} />;
    //     },
    //     tabBarActiveTintColor: '#309264',
    //     tabBarInactiveTintColor: 'gray',
    //     tabBarShowLabel: true,
    //   })}
    // >
    //   <Tab.Screen name="Home" component={HomePage} />
    //   <Tab.Screen name="Add" component={StorePage} />
    //   <Tab.Screen name="User">
    //     {() => <UserInfoTab setIsLoggedIn={setIsLoggedIn} />}
    //   </Tab.Screen>
    // </Tab.Navigator>

  );
}

export default CompanyInfo;