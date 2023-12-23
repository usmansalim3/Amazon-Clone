import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign,Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { decrementQuantity, incementQuantity, removeFromCart } from "../../redux/CartReducer";
import { addWish } from "../../redux/UserReducer";
import { link } from "../../data/data";
import Toast, { BaseToast } from "react-native-toast-message";

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userName, addresses, userId,wishlist } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart)
  function getSubtotal() {
    let subTotal = 0;
    cart.forEach((item) => (subTotal += item.price*(item.quantity)));
    return subTotal;
  }

  async function addToWishlist(item){
    try{
      const {data}=await axios.post(`${link}/wishlist/add`,{
        userId,
        item
      })
      if(data.success){
        dispatch(addWish(item))
      Toast.show({type:'success',text1:"Added to wishlist",position:"bottom"})
      }
      // setInWish(true)
    }catch(e){
      console.log(e)
    }
  }

  async function increaseQtyHandler(id){
    try{
      const res=await axios.post(`${link}/cart/increase`,{
        userId,
        itemId:id
      })
      console.log(res.data);
      dispatch(incementQuantity(id))
    }catch(e){
      console.log(e)
    }
  }

  async function decreaseQtyHandler(id){
    console.log(id)
    try{
      const res=await axios.post(`${link}/cart/decrease`,{
        userId,
        itemId:id
      })
      console.log(res.data);
      dispatch(decrementQuantity(id))
    }catch(e){
      console.log(e)
    }
  }

  async function removeFromCartHandler(id){
    try{
      const res=await axios.post(`${link}/cart/remove`,{
        userId,
        itemId:id
      })
      console.log(res.data);
      dispatch(removeFromCart(id))
    }catch(e){
      console.log(e)
    }
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
            style={{
              backgroundColor: "#00CED1",
              width: "100%",
              padding: 10,
              paddingTop:Platform.OS=='android'?StatusBar.currentHeight+5:StatusBar.currentHeight,
              flexDirection: "row",
              alignItems: "center",
              marginBottom:10
            }}
          >
            <Pressable 
              onPress={()=>{
                navigation.navigate('search');
              }}
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                padding: 5,
                alignItems: "center",
                elevation: 5,
                flex: 1,
              }}
            >
              <Ionicons
                name="search-outline"
                size={22}
                style={{ marginRight: 5 }}
                color="black"
              />
              <TextInput
                placeholder="Search Products"
                onTouchStart={()=>navigation.navigate('search')}
                style={{ backgroundColor: "white", width: "90%" }}
              />
            </Pressable>
            <Ionicons
              name="mic-outline"
              size={26}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </View>
      <View style={{ paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          Subtotal : ${getSubtotal()}
        </Text>
        <Text>EMI details available</Text>
        <Pressable
          onPress={()=>{
            if(cart.length){
              // navigation.navigate('checkout')
            }else{
              Toast.show({text1:'Cart is empty',position:"bottom"})
            }
          }}
          style={{
            padding: 10,
            borderRadius: 3,
            backgroundColor: "#ffc72c",
            width: "100%",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 16, fontWeight: "500" }}
          >
            Proceed to checkout
          </Text>
        </Pressable>
      </View>
      <Text
        style={{
          height: 0.5,
          borderColor: "#D0D0D0",
          borderWidth: 0.5,
          marginTop: 15,
          marginBottom:3
        }}
      />
      <FlatList
        data={cart}
        contentContainerStyle={{marginHorizontal:5}}
        renderItem={({ item }) => {
          return (
            <View style={{marginBottom:20}}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:0.4,marginRight:5}}>
                            <Image source={{uri:item.image}} style={{resizeMode:"contain",height:120,width:'100%'}}/>
                            <View
                      style={{
                        alignItems: "center",
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#B7B7B7",
                          padding: 3,
                          borderRadius: 5,
                        }}
                      >
                        <AntDesign name={item.quantity>1?"minus":"delete"} onPress={item.quantity>1?()=>decreaseQtyHandler(item.id):()=>removeFromCartHandler(item.id)} size={20} color="grey" />
                      </View>
                      <Text style={{ fontSize: 20 }}>{item.quantity}</Text>
                      <View
                        style={{
                          backgroundColor: "#B7B7B7",
                          padding: 3,
                          borderRadius: 5,
                        }}
                      >
                        <AntDesign name="plus" size={20} color="grey" onPress={()=>increaseQtyHandler(item.id)} />
                      </View>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between"}}>
                    <Pressable onPress={()=>removeFromCartHandler(item.id)} style={{borderWidth:1,borderColor:"#b7b7b7",borderRadius:3,paddingHorizontal:10,marginTop:10,paddingVertical:5}}>
                         <Text style={{textAlign:'center'}}>Delete</Text>
                     </Pressable> 
                     <Pressable onPress={()=>{
                      addToWishlist(item)
                     }} style={{borderWidth:1,borderColor:"#b7b7b7",borderRadius:3,paddingHorizontal:10,marginTop:10,paddingVertical:5}}>
                         <Text style={{textAlign:'center'}}>Wishlist</Text>
                     </Pressable>   
                    </View>
                        <View>
                  </View>
                        </View>
                        <View style={{flex:0.6}}>
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
                        </View>
                    </View>
                </View>
            // <View style={{ marginBottom: 20 }}>
            //   <View
            //     style={{
            //       flexDirection: "row",
            //       gap: 30,
            //       marginBottom: 20,
            //       width: "95%",
            //       alignSelf: "center",
            //     }}
            //   >
            //     <View style={{ justifyContent: "center" }}>
            //       <Image
            //         source={{ uri: item.image }}
            //         style={{ width: 120, height: 120, resizeMode: "contain" }}
            //       />
            //       <View>
            //         <View
            //           style={{
            //             alignItems: "center",
            //             marginTop: 30,
            //             flexDirection: "row",
            //             justifyContent: "space-between",
            //           }}
            //         >
            //           <View
            //             style={{
            //               backgroundColor: "#B7B7B7",
            //               padding: 3,
            //               borderRadius: 5,
            //             }}
            //           >
            //             <AntDesign name={item.quantity>1?"minus":"delete"} onPress={item.quantity>1?()=>decreaseQtyHandler(item.id):()=>removeFromCartHandler(item.id)} size={20} color="grey" />
            //           </View>
            //           <Text style={{ fontSize: 20 }}>{item.quantity}</Text>
            //           <View
            //             style={{
            //               backgroundColor: "#B7B7B7",
            //               padding: 3,
            //               borderRadius: 5,
            //             }}
            //           >
            //             <AntDesign name="plus" size={20} color="grey" onPress={()=>increaseQtyHandler(item.id)} />
            //           </View>
            //         </View>
            //       </View>
            //     </View>
            //     <View style={{ gap: 5, width: "60%" }}>
            //       <Text numberOfLines={3}>{item.title}</Text>
            //       <Text numberOfLines={3}>{item.description}</Text>
            //       <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            //         ${item.price}
            //       </Text>
            //       <View
            //         style={{
            //           flexDirection: "row",
            //           alignItems: "center",
            //           justifyContent: "space-between",
            //         }}
            //       >
            //         <Image
            //           style={{ width: 35, height: 35, resizeMode: "contain" }}
            //           source={{
            //             uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
            //           }}
            //         />
            //         <Text
            //           style={{ color: "green", fontWeight: "500", bottom: 5 }}
            //         >
            //           In Stock
            //         </Text>
            //       </View>
            //     </View>
            //   </View>
            //   <View style={{ flexDirection: "row", gap: 20, marginLeft: 10 }}>
            //     <Pressable
            //       onPress={()=>removeFromCartHandler(item.id)}
            //       style={{
            //         borderWidth: 1,
            //         borderRadius: 5,
            //         borderColor: "#B7B7B7",
            //         padding: 8,
            //       }}
            //     >
            //       <Text style={{ textAlign: "center" }}>Delete</Text>
            //     </Pressable>
            //     <Pressable
            //       style={{
            //         borderWidth: 1,
            //         borderRadius: 5,
            //         borderColor: "#B7B7B7",
            //         padding: 8,
            //       }}
            //     >
            //       <Text style={{ textAlign: "center" }}>Buy later</Text>
            //     </Pressable>
            //   </View>
            // </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
