import { StyleSheet, Text, View,SafeAreaView, FlatList, Image, Pressable } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {AntDesign,} from "@expo/vector-icons"
import axios from 'axios'
import { removeFromWish } from '../../redux/UserReducer'
import { link } from '../../data/data'
import { StackActions, useNavigation } from '@react-navigation/native'
import {Ionicons} from "@expo/vector-icons"

const WishlistScreen = () => {
  const dispatch=useDispatch();
  const userId=useSelector(state=>state.user.userId)
  const wishlist=useSelector(state=>state.user.wishlist);
  const navigation=useNavigation();

  async function removeHandler(id){
    console.log(id,userId)
    const res=await axios.get(`${link}/wishlist/remove/${userId}/${id}`);
    dispatch(removeFromWish(id));
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 0,
        backgroundColor:"white"
      }}
    >
      <View style={{flexDirection:"row",gap:10,alignItems:"center",marginBottom:10,marginLeft:10}}>
        <Ionicons name="chevron-back-sharp" size={24} color="black" style={{top:2}} onPress={()=>navigation.goBack()} />
        <Text style={{fontSize:22}}>Your Wishlist</Text>
      </View>
        <FlatList data={wishlist} contentContainerStyle={{marginLeft:10}} renderItem={({item})=>{
            return(
                <View style={{flexDirection:'row',flex:1,marginRight:10,paddingVertical:5}}>
                    <View style={{flex:0.4,justifyContent:"center",alignItems:'center',marginRight:5}}>
                        <Image source={{uri:item.image}} style={{resizeMode:"contain",height:120,width:'100%',alignSelf:'center'}}/>
                    </View>
                    <View style={{flex:0.6}}>
                    <Text numberOfLines={2} style={{marginBottom:10,fontWeight:'500'}}>{item.title}</Text>
                    <Text numberOfLines={3} >{item.description}</Text>
                    <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
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
                    <Pressable onPress={()=>{
                        removeHandler(item.id)
                    }} style={{borderWidth:1,borderRadius:3,paddingHorizontal:10,marginTop:10,paddingVertical:5}}>
                        <Text style={{textAlign:'center'}}>Remove from wishlist</Text>
                    </Pressable>
                    </View>
                </View>
                // <View style={{marginBottom:20}}>
                //     <View style={{flex:1,flexDirection:'row'}}>
                //         <View style={{flex:0.4,marginRight:5}}>
                //             <Image source={{uri:item.image}} style={{resizeMode:"contain",height:120,width:'100%'}}/>
                //             <View
                //       style={{
                //         alignItems: "center",
                //         marginTop: 10,
                //         flexDirection: "row",
                //         justifyContent: "space-between"
                //       }}
                //     >
                //       <View
                //         style={{
                //           backgroundColor: "#B7B7B7",
                //           padding: 3,
                //           borderRadius: 5,
                //         }}
                //       >
                //         <AntDesign name={"minus"} onPress={()=>{}} size={20} color="grey" />
                //       </View>
                //       <Text style={{ fontSize: 20 }}>3</Text>
                //       <View
                //         style={{
                //           backgroundColor: "#B7B7B7",
                //           padding: 3,
                //           borderRadius: 5,
                //         }}
                //       >
                //         <AntDesign name="plus" size={20} color="grey" />
                //       </View>
                //     </View>
                //     <View style={{flexDirection:'row',justifyContent:"space-between"}}>
                //     <Pressable style={{borderWidth:1,borderColor:"#b7b7b7",borderRadius:3,paddingHorizontal:10,marginTop:10,paddingVertical:5}}>
                //          <Text style={{textAlign:'center'}}>Delete</Text>
                //      </Pressable> 
                //      <Pressable style={{borderWidth:1,borderColor:"#b7b7b7",borderRadius:3,paddingHorizontal:10,marginTop:10,paddingVertical:5}}>
                //          <Text style={{textAlign:'center'}}>Wishlist</Text>
                //      </Pressable>   
                //     </View>
                //         <View>
                //   </View>
                //         </View>
                //         <View style={{flex:0.6}}>
                //             <Text style={{fontWeight:'500',marginBottom:10}}>{item.title}</Text>
                //             <Text numberOfLines={3} style={{marginBottom:10}}>{item.description}</Text>
                //             <Text style={{fontWeight:"bold",fontSize:17}}>${item.price}</Text>
                //             <View style={{flexDirection:"row",alignItems:'center',justifyContent:"space-between"}}>
                //             <Image
                //       style={{ width: 35, height: 35, resizeMode: "contain" }}
                //       source={{
                //         uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                //       }}
                //     />
                //     <Text
                //       style={{ color: "green", fontWeight: "500", bottom: 5,marginRight:5 }}
                //     >
                //       In Stock
                //     </Text>
                //             </View>
                //         </View>
                //     </View>
                // </View>
            )
        }}/>
    </SafeAreaView>
  )
}

export default WishlistScreen

const styles = StyleSheet.create({})