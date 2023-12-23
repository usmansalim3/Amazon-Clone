import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CartScreen from "./Screens/CartScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import LandingScreen from "./Screens/LandingScreen";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SingleProductScreen from "./Screens/SingleProductScreen";
import AddAddress from "./Screens/AddAddress";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import YourAddresses from "./Screens/YourAddresses";
import SearchScreen from "./Screens/SearchScreen";
import { useSelector } from "react-redux";
import WishlistScreen from "./Screens/WishlistScreen";
import CheckoutScreen from "./Screens/CheckoutScreen";


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

function ShoppingStack(){
  const stack=createNativeStackNavigator();
  return(
    <>
    <stack.Navigator screenOptions={{
      headerShown:false
    }}>
      <stack.Screen component={LandingScreen}  name="main"/>
      <stack.Screen component={CheckoutScreen} name="checkout"/>
      {/* <stack.Screen component={WishlistScreen} name="wishlist"/> */}
      <stack.Screen component={SearchScreen} name="search" options={{
        animation:'none'
      }}/>
      {/* <stack.Screen component={SingleProductScreen} name="SingleProduct"/> */}
      {/* <stack.Screen component={YourAddresses} name="yourAddresses"/>
      <stack.Screen component={AddAddress} name="addAddress"/> */}
    </stack.Navigator>
    </>
  )
}
const Home = () => {
  const bottomTabs = createBottomTabNavigator();
  const cart=useSelector(state=>state.cart.cart)
  return (
    <bottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          color: "#008E97",
          marginBottom:5
        },
        tabBarHideOnKeyboard:true,
      }}
    >
      <bottomTabs.Screen
        name="Home"
        component={ShoppingStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={size}
              color="#008E97"
            />
          ),
        }}
      />
      <bottomTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ios-person-sharp" : "ios-person-outline"}
              size={24}
              color="#008E97"
            />
          ),
        }}
      />
      <bottomTabs.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View>
            <View style={{backgroundColor:'#E31837',borderRadius:10,position:'absolute',right:1,top:0,zIndex:10,paddingHorizontal:3}}>
              <Text style={{fontSize:9,color:'white'}}>
              {cart?.length}
              </Text>
            </View>
            <Ionicons
              name={focused ? "ios-cart-sharp" : "ios-cart-outline"}
              size={28}
              color="#008E97"
            />
            </View>
          ),
        }}
      />
    </bottomTabs.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({});
