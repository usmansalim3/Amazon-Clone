import { Button, Pressable, StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/UserReducer'

const ProfileScreen = () => {
  const navigation=useNavigation();
  const dispatch=useDispatch();
  const userName=useSelector(state=>state.user.userName)
  return (
    <SafeAreaView style={{paddingTop:50}}>
      <View>
        <Text style={{fontWeight:'700',fontSize:22,marginLeft:12,marginBottom:10}}>Welcome {userName}</Text>
        <View style={{flexWrap:'wrap',flexDirection:'row',rowGap:10,columnGap:5,paddingHorizontal:10}}>
          <Pressable onPress={()=>navigation.navigate('orders')} style={{backgroundColor:"#D0D0D0",borderRadius:10,paddingHorizontal:10,paddingVertical:10,width:"49%"}}><Text style={{fontWeight:'600',textAlign:'center',fontSize:16,fontWeight:'600'}}>Your orders</Text></Pressable>
          <Pressable onPress={()=>navigation.navigate('yourAddresses')} style={{backgroundColor:"#D0D0D0",borderRadius:10,paddingHorizontal:10,paddingVertical:10,width:"49%"}}><Text style={{fontWeight:'600',textAlign:'center',fontSize:16}}>Your Addresses</Text></Pressable>
          <Pressable onPress={()=>navigation.navigate('wishlist')} style={{backgroundColor:"#D0D0D0",borderRadius:10,paddingHorizontal:10,paddingVertical:10,width:"49%"}}><Text style={{fontWeight:'600',textAlign:'center',fontSize:16}}>Wishlist</Text></Pressable>
          <Pressable onPress={()=>{
            AsyncStorage.removeItem('token');
            navigation.dispatch(CommonActions.reset({index:0,routes:[{name:'auth'}]}));
            dispatch(logout());
          }} style={{backgroundColor:"#D0D0D0",borderRadius:10,paddingHorizontal:10,paddingVertical:10,width:"49%"}}><Text style={{fontWeight:'600',textAlign:'center',fontSize:16}}>Log out</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})
