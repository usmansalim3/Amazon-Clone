import { SafeAreaView, StyleSheet, Text, View,Platform,Image } from 'react-native'
import React, { useEffect } from 'react'
import { StackActions, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loggedIn } from '../../redux/UserReducer';
import { setCart } from '../../redux/CartReducer';
import { link } from '../../data/data';

const Splash = () => {
  const navigation=useNavigation();
  const dispatch=useDispatch();
  useEffect(()=>{
    
    AsyncStorage.getItem("token").then(async (res)=>{
      try{
        if(res!==null){
          res=JSON.parse(res);
          console.log(res)
          const decodedJWT=jwtDecode(res.token)
          const userData=await axios.get(`${link}/profile/${decodedJWT.userId}`);
          const cartData=await axios.get(`${link}/cart/getCart/${decodedJWT.userId}`);
          const orderData=await axios.get(`${link}/orders/${decodedJWT.userId}`);
          const {user}=userData.data
          const {cart}=cartData.data
          const {orders}=orderData.data
          console.log(user.defaultAddress,"users")
          dispatch(loggedIn({userId:user._id,userName:user.name,addresses:user.addresses,defaultAddress:user.defaultAddress,wishlist:user.wishlist,orders}))
          dispatch(setCart(cart))
            navigation.dispatch(StackActions.replace("HomeTabs"))
        }else{
            navigation.dispatch(StackActions.replace("auth"))
        }
      }catch(e){
        console.log(e);
      }
        // if(res!==null){
        //   res=JSON.parse(res);
        //   console.log(res)
        //   const decodedJWT=jwtDecode(res.token)
        //   const userData=await axios.get(`${"192.168.43.172:3000"}/profile/${decodedJWT.userId}`);
        //   const cartData=await axios.get(`${"192.168.43.172:3000"}/cart/getCart/${decodedJWT.userId}`);
        //   const {user}=userData.data
        //   const {cart}=cartData.data
        //   console.log(user,"users")
        //   dispatch(loggedIn({userId:user._id,userName:user.name,addresses:user.addresses,orders:user.orders,defaultAddress:user.defaultAddress,wishlist:user.wishlist}))
        //   dispatch(setCart(cart))
        //     navigation.dispatch(StackActions.replace("HomeTabs"))
        // }else{
        //     navigation.dispatch(StackActions.replace("auth"))
        // }
    })
  },[])
  return (
    <SafeAreaView style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 0,
        backgroundColor: "white",
        justifyContent:'center',
        alignItems:'center'
    }}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 150}}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Splash

const styles = StyleSheet.create({})