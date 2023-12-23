import { SafeAreaView, StyleSheet, Text, View,StatusBar,Image, Pressable} from 'react-native'
import React from 'react'
import {Ionicons,AntDesign} from "@expo/vector-icons"
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler'

const ViewOrder = () => {
  const navigation=useNavigation();
  const route=useRoute();
  console.log(route.params.item)
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <View style={{flexDirection:"row",gap:10,alignItems:"center",marginBottom:20,marginLeft:10,marginTop:StatusBar.currentHeight+5}}>
            <Ionicons name="chevron-back-sharp" size={24} color="black" onPress={()=>navigation.goBack()} />
        <Text style={{fontSize:24}}>Your Order</Text>
        </View>
        <FlatList data={route.params.item.products} ItemSeparatorComponent={()=>{
            return(
                <Text
            style={{
              height: 0.8,
              borderColor: "#D0D0D0",
              borderWidth: 0.5,
              marginVertical: 10,
              marginBottom:15
            }}
          />
            )
        }} renderItem={({item,index})=>{
            return(
                <Pressable style={{marginBottom:index==route.params.item.products.length-1?10:0}} onPress={()=>{
                    navigation.navigate('SingleProduct',{
                        productDetails:item
                    })
                }}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:0.3}}>
                            <Image source={{uri:item.image}} style={{resizeMode:"contain",height:120,width:'100%'}}/>
                        <View>
                  </View>
                        </View>
                        <View style={{flex:0.69}}>
                            <Text style={{fontWeight:'500',marginBottom:10}}>{item.title}</Text>
                            <Text numberOfLines={3} style={{marginBottom:10}}>{item.description}</Text>
                            <Text style={{fontWeight:"bold",fontSize:17}}>${item.price}</Text>
                            <View style={{flexDirection:"row",alignItems:'center',justifyContent:"space-between"}}>
                            <Image
                      style={{ width: 35, height: 35, resizeMode: "contain" }}
                      source={{
                        uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                      }}
                    />
                    <Text
                      style={{ color: "green", fontWeight: "500", bottom: 5,marginRight:5 }}
                    >
                      In Stock
                    </Text>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                <Text style={{fontSize:16}}>
                                    Quantity
                                </Text>
                                <Text style={{fontSize:16,marginRight:5}}>{item.quantity}</Text>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )
        }}/>
    </SafeAreaView>
  )
}

export default ViewOrder

const styles = StyleSheet.create({})