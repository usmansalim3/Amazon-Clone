import { SafeAreaView, StyleSheet, Text, View,StatusBar, Pressable } from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import moment from 'moment/moment'


const Orders = () => {
  const navigation=useNavigation();
  const {userId,orders,userName}=useSelector(state=>state.user)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
        <View style={{flexDirection:"row",gap:10,alignItems:"center",marginBottom:10,marginLeft:10,marginTop:StatusBar.currentHeight+5}}>
            <Ionicons name="chevron-back-sharp" size={24} color="black" onPress={()=>navigation.goBack()} />
        <Text style={{fontSize:24}}>Your Orders</Text>
        </View>
        <FlatList data={orders} ItemSeparatorComponent={()=>{
            return(
                <Text
            style={{
              height: 0.8,
              borderColor: "#D0D0D0",
              borderWidth: 0.5,
              marginVertical: 5,
            }}
          />
            )
        }} renderItem={({item})=>{
            return(
                <Pressable onPress={()=>{
                    navigation.navigate('viewOrder',{
                        item
                    })
                }} style={{marginVertical:10}}>
                <View style={{backgroundColor:'white'}}>
                <View style={{flex:0.22,borderRadius:3,borderWidth:1,borderColor:'#D0D0D0',marginHorizontal:20,paddingHorizontal:10,paddingVertical:10,marginBottom:10}}>
                    <Text style={{color:"grey",fontSize:17,marginBottom:5}}>Shipping to {item.shippingAddress.name}</Text>
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>Items</Text>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>${item.totalPrice}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>Delivery</Text>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>$10</Text>
                    </View>
                    {/* C60C30 */}
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:20,fontWeight:"bold"}}>Total </Text>
                        <Text style={{fontSize:16,color:'#C60C30',fontWeight:"800"}}>${(parseInt(item.totalPrice)+parseInt(10))}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:16,color:"#B7B7B7"}}>Ordered on </Text>
                        <Text style={{fontSize:16,color:'#B7B7B7',fontWeight:"800"}}>{moment(item.createdAt).format("MMM Do YYYY")}</Text>
                        
                    </View>
                </View>
                <View style={{marginHorizontal:20,borderWidth:1,borderColor:"#B7B7B7",borderRadius:3,paddingHorizontal:10,paddingVertical:10}}>
                    <Text style={{color:'grey'}}>Paid With</Text>
                    <Text>{item.paymentMethod}</Text>
                </View>
            </View>
            </Pressable>
            )
        }}/>
    </SafeAreaView>
  )
}

export default Orders

const styles = StyleSheet.create({})