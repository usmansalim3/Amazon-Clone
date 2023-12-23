import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './navigation/Home';
import { ModalPortal } from 'react-native-modals';
import LoginScreen from './navigation/Screens/LoginScreen';
import RegisterScreen from './navigation/Screens/RegisterScreen';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {AntDesign} from "@expo/vector-icons"
import CartReducer from './redux/CartReducer';
import { Provider } from 'react-redux';
import userReducer from './redux/UserReducer';
import { useEffect, useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './navigation/Screens/Splash';
import ProductsReducer from './redux/ProductsReducer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast, { BaseToast } from 'react-native-toast-message';
import WishlistScreen from './navigation/Screens/WishlistScreen';
import AddAddress from './navigation/Screens/AddAddress';
import YourAddresses from './navigation/Screens/YourAddresses';
import CheckoutScreen from './navigation/Screens/CheckoutScreen';
import Orders from './navigation/Screens/Orders';
import ViewOrder from './navigation/Screens/ViewOrder';
import SingleProductScreen from './navigation/Screens/SingleProductScreen';

export default function App() {
  const reducer=combineReducers({
    user:userReducer,
    cart:CartReducer,
    products:ProductsReducer
  })
  const store=configureStore({
    reducer:reducer
  })
  function AuthStack(){
    const stack=createNativeStackNavigator();
    return(
      <stack.Navigator>
        <stack.Screen name="login" component={LoginScreen} options={{headerShown:false}}/>
        <stack.Screen name="register" component={RegisterScreen} options={{headerShown:false}}/>
      </stack.Navigator>
    )
  }
  function OtherScreensStack(){
    const stack=createNativeStackNavigator();
    return(
      <stack.Navigator>
        <stack.Screen component={WishlistScreen} name="wishlist"/>
        <stack.Screen component={YourAddresses} name="yourAddresses"/>
        <stack.Screen component={AddAddress} name="addAddress"/>
      </stack.Navigator>
    )
  }

  const stack=createNativeStackNavigator();
  const toastConfig = {
    success: (props) => (
      <BaseToast
        renderLeadingIcon={()=><AntDesign name="amazon" size={24} style={{marginLeft:10}} color="#00CED1" />}
        {...props}
        style={{ borderLeftColor: '#00CED1',alignItems:"center" }}
        contentContainerStyle={{ paddingHorizontal: 15,alignItems:'center' }}
        text1Style={{
          fontSize: 15,
          fontWeight: '400'
        }}
      />
    ),}
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <StatusBar style='light'/>
    <Provider store={store}>
  <BottomSheetModalProvider>
    <NavigationContainer>
      <stack.Navigator >
        <stack.Screen name="splash" component={Splash} options={{headerShown:false}}/>
        <stack.Screen name='auth' component={AuthStack} options={{headerShown:false}}/>
        <stack.Screen component={Home} name='HomeTabs' options={{headerShown:false}}/>
        <stack.Screen component={WishlistScreen} name="wishlist" options={{headerShown:false}}/>
        <stack.Screen component={YourAddresses} name="yourAddresses" options={{headerShown:false}}/>
        <stack.Screen component={AddAddress} name="addAddress" options={{headerShown:false}}/>
        <stack.Screen component={CheckoutScreen} name="checkout" options={{headerShown:false}}/>
        <stack.Screen component={Orders} name="orders" options={{headerShown:false}}/>
        <stack.Screen component={ViewOrder} name="viewOrder" options={{headerShown:false}}/>
        <stack.Screen component={SingleProductScreen} name="SingleProduct" options={{headerShown:false}}/>
      </stack.Navigator>
    </NavigationContainer>
    <ModalPortal/>
    <Toast config={toastConfig}/>
  </BottomSheetModalProvider>
    </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
