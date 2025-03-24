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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="UserInfo" component={UserInfo} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={StackNavigator} />
        <Tab.Screen name="User" component={UserInfo} />
        {/* <Tab.Screen name='Add'/> */}
      </Tab.Navigator>
      {/* <Stack.Navigator initialRouteName="Home"> */}
      {/* <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name="Userinfo" component={UserInfo} options={{ headerShown: false }} /> */}
      {/* <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='registration' component={Registration} options={{ headerShown: false }} />
        <Stack.Screen name='addstore' component={AddStore} options={{ headerShown: false }} />
        <Stack.Screen name='incomplete' component={Incomplete} options={{ headerShown: false }} />
        <Stack.Screen name='mystore' component={MyStore} options={{ headerShown:false}} />
        <Stack.Screen name='storeinfo' component={StoreInfo} options={{headerShown:false}} /> */}
      {/* <Stack.Screen name='Tab' component={TabNavigate} options={{ headerShown: false }} /> */}
      {/* </Stack.Navigator> */}
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
