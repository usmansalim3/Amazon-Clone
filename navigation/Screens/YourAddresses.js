import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Feather, AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { removeAddress, setDefaultAddress } from '../../redux/UserReducer';
import { link } from '../../data/data';
import {Ionicons} from "@expo/vector-icons"

const YourAddresses = () => {
  const addresses=useSelector(state=>state.user.addresses);
  const userId=useSelector(state=>state.user.userId);
  const defaultAddress=useSelector(state=>state.user.defaultAddress)
  const dispatch=useDispatch();
  const navigation=useNavigation();

  async function removeAddressHandler(addressId){
    console.log("removing",addressId)
    try{
      const res=await axios.get(`${link}/addresses/removeAddress/${userId}/${addressId}`)
      console.log(res.data);
      dispatch(removeAddress(addressId))
    }catch(e){
      console.log(e)
    }
  }
  // console.log(defaultAddress.addressID)
  async function setDefaultAddressHandler(address){
    try{
      const res=await axios.post(`${link}/addresses/setDefault`,{
        userId,
        address
      });
      console.log(res.data);
      dispatch(setDefaultAddress(address))
    }catch(e){
      console.log(e);
    }
  }
  return (
    <SafeAreaView style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 0,
        backgroundColor: "white",
    }}>
      <View style={{flexDirection:"row",gap:10,alignItems:"center",marginBottom:10,marginLeft:10}}>
        <Ionicons name="chevron-back-sharp" size={24} color="black" onPress={()=>navigation.goBack()} />
        <Text style={{fontSize:24}}>Your Addresses</Text>
      </View>
      <Pressable onPress={()=>navigation.navigate('addAddress')} style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            paddingVertical: 7,
            paddingHorizontal: 5,
            marginHorizontal:10
        }}>
            <Text style={{fontWeight:'500',fontSize:14}}>Add a new address</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
            
      </Pressable>
      <FlatList data={addresses} contentContainerStyle={{marginHorizontal:10}} showsVerticalScrollIndicator={false} renderItem={({item})=>{
        return(
          <View style={{
            borderWidth:1,
            borderColor:'#D0D0D0',
            padding:10,
            marginVertical:10,
            alignSelf:'stretch',
            marginHorizontal:0
          }}>
          <Pressable>
            <View style={{gap:1}}>
              <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
              <Text style={{fontSize:18,fontWeight:'600'}}>{item.name}</Text>
              <Entypo name="location-pin" size={22} color="red" />
              </View>
              <Text style={{fontSize:16}}>
              {item.houseNo.charAt(0).toUpperCase()+item.houseNo.slice(1)}
              </Text>
              <Text style={{fontSize:16}}>{item.street.charAt(0).toUpperCase()+item.street.slice(1)}</Text>
              <Text style={{fontSize:16}}>
                {item.landmark.charAt(0).toUpperCase()+item.landmark.slice(1)}
              </Text>
              <Text style={{fontWeight:'500',fontSize:16}}>
              {(item.city+" - ").charAt(0).toUpperCase(0)+item.city.slice(1)}
              {' - '+item.postalCode}
              </Text>
              <Text style={{fontSize:16}}>
                {item.mobileNo}
              </Text>
            </View>
          </Pressable>
          <View style={{flexDirection:'row',gap:10,marginTop:10,flexWrap:'wrap'}}>
            <Pressable onPress={()=>{
              navigation.navigate('addAddress',{
                address:item
              })
            }} style={{
              borderWidth:1,
              borderColor:'#D0D0D0',
              padding:5,
              paddingHorizontal:10
            }}>
              <Text>Edit</Text>
            </Pressable>
            <Pressable onPress={()=>removeAddressHandler(item.addressID)} style={{
              borderWidth:1,
              borderColor:'#D0D0D0',
              padding:5,
              paddingHorizontal:10
            }}>
              <Text>Remove</Text>
            </Pressable>
            {(defaultAddress!=undefined&&defaultAddress.addressID!=item.addressID)?<Pressable onPress={()=>setDefaultAddressHandler(item)} style={{
              borderWidth:1,
              borderColor:'#D0D0D0',
              padding:5,
              paddingHorizontal:10
            }}>
              <Text>Set as default</Text>
            </Pressable>:<></>}
          </View>
            </View>
        )
      }}/>
      
    </SafeAreaView>
  )
}

export default YourAddresses

const styles = StyleSheet.create({})