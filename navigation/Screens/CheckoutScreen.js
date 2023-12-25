import { BackHandler, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View,ScrollView } from 'react-native'
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {MaterialIcons,Entypo,Ionicons,AntDesign} from "@expo/vector-icons"
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import axios, { Axios } from 'axios';
import Toast from 'react-native-toast-message';
import { link } from '../../data/data';

import { cleanCart, decrementQuantity, incementQuantity, removeFromCart } from "../../redux/CartReducer";
import { addOrders, addWish } from "../../redux/UserReducer";
import LottieView from 'lottie-react-native';
import { useEffect } from 'react';
const CheckoutScreen = () => {
    const steps = [
        { title: "Address", content: "Address Form" },
        { title: "Delivery", content: "Delivery Options" },
        { title: "Payment", content: "Payment Details" },
        { title: "Confirmation", content: "Order Summary" },
    ];
    const [active,setActive]=useState(1);
    const [paymentMethod,setPaymentMethod]=useState();
    const [delivery,setDelivery]=useState();
    const [deliveryAddress,setDeliveryAddress]=useState();

    function PaymentMethod(){
        const [selectedOption,setSelectedOption]=useState('');
        return(
            <>
            <View style={{flexDirection:"row",justifyContent:"space-between",marginHorizontal:10,marginBottom:5,alignItems:'center'}}>
            <Text style={{fontWeight:"bold",fontSize:18}}>{steps[active].content}</Text>
            <Pressable style={{paddingHorizontal:10,paddingVertical:5,borderRadius:16,backgroundColor:paymentMethod?"#ffc72c":"#eaeaea"}} onPress={()=>{
                if(paymentMethod){
                    setActive((active)=>active+1)
                }
            }}><Text>Proceed</Text></Pressable>
            </View>
            <View style={{gap:10,marginHorizontal:10}}>
                <Pressable onPress={()=>setPaymentMethod('COD')} style={{flexDirection:"row",gap:5,padding:10,borderWidth:1,borderRadius:3,borderColor:"#B7B7B7",alignItems:'center'}}>
                    <MaterialIcons name={paymentMethod=='COD'?"radio-button-on":"radio-button-off"} size={20} color={'#008397'}/>
                    <Text>Cash On Delivery</Text>
                </Pressable>
                <Pressable onPress={()=>setPaymentMethod("UPI/credit/debit")} style={{flexDirection:"row",gap:5,padding:10,borderWidth:1,borderRadius:3,borderColor:"#B7B7B7",alignItems:'center'}}>
                    <MaterialIcons name={paymentMethod=='UPI/credit/debit'?"radio-button-on":"radio-button-off"} size={20} color={'#008397'}/>
                    <Text>UPI</Text>
                </Pressable>
            </View>
            </>
        )
    }

    function DeliveryOption(){
        const [selectedDeliveryOption,setSelectedDeliveryOption]=useState('');
        return(
            <>
            <View style={{flexDirection:"row",justifyContent:"space-between",marginHorizontal:10,marginBottom:5}}>
            <Text style={{fontWeight:"bold",fontSize:18}}>{steps[active-1].content}</Text>
            <Pressable style={{paddingHorizontal:10,paddingVertical:5,borderRadius:16,backgroundColor:delivery?"#ffc72c":"#eaeaea"}} onPress={()=>{
                if(delivery){
                    setActive((active)=>active+1)
                }
            }
                }><Text>Proceed</Text></Pressable>
            </View>
            <View style={{flex:1}}>
                <Pressable onPress={()=>{
                    setDelivery("10 AM PRIME TOMORROW")
                }} style={{flexDirection:"row",gap:5,alignItems:'center',marginHorizontal:10,borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 10,paddingVertical:5,paddingHorizontal:10}}>
                <MaterialIcons name={delivery=="10 AM PRIME TOMORROW"?"radio-button-on":"radio-button-off"} size={20} color={'#008397'}/>
                <View style={{flexDirection:"row",flex:1}}>
                    <Text>
                    <Text style={{ color: "green", fontWeight: "500" }}>
                        Tomorrow by 10pm
                    </Text>{" "}
                    - FREE delivery with your Prime membership
                    </Text>
                </View>
                </Pressable>
            </View>
            </>
        )
    }
// rzp_test_LISfKW7q76gQNR
    function PlaceOrder(){
        const [deliveryCost,setDeliveryCost]=useState(0);
        const [cartCost,setCartCost]=useState(0);
        const [totalCost,setTotalCost]=useState(0);
        const options=useMemo(()=>{
          return {
            description: 'Prdo',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_LISfKW7q76gQNR', // Your api key
            amount: "",
            name: 'foo',
            prefill: {
              email: 'void@razorpay.com',
              contact: '9191919191',
              name: 'Razorpay Software',
            },
            theme: {color: '#F37254'},
          };
        },[])
        const dispatch = useDispatch();
        const { userName, addresses, userId,wishlist } = useSelector((state) => state.user);
        const cart = useSelector((state) => state.cart.cart);
        console.log(cart)
        useLayoutEffect(()=>{
            getCartPrice()
        },[cart,dispatch])
  function getSubtotal() {
    let subTotal = 0;
    cart.forEach((item) => (subTotal += item.price));
    return subTotal;
  }

  async function checkoutHandler(){
    try{
      const cartCopy=cart.map(items=>items);
      setActive(active=>active+1);
      const order={
      userId,
      products:cartCopy,
      totalPrice:totalCost,
      shippingAddress:deliveryAddress,
      paymentMethod:paymentMethod
      }
      const {data}=await axios.post(`${link}/orders`,{
      ...order
    })
    dispatch(addOrders(order));
    dispatch(cleanCart());
    console.log(data);
    }catch(e){
      console.log(e);
    }
  }

  async function addToWishlist(item){
    try{
      const {data}=await axios.post(`${link}/wishlist/add`,{
        userId,
        item
      })
      if(data.success){
        dispatch(addWish(item))
        dispatch(removeFromCart(item.id))
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
        function getCartPrice(){
            let price=0;
            let deliveryCost=0;
            cart.forEach((item)=>price+=item.price*item.quantity);
            if(price<20){
                deliveryCost=6;
            }
            setCartCost((price).toFixed(2))
            setDeliveryCost(deliveryCost);
            setTotalCost((price+deliveryCost).toFixed(2));
        }

        return(
          <>
            <ScrollView>
            <View style={{flexDirection:"row",justifyContent:"space-between",marginHorizontal:10,marginBottom:5}}>
            <Text style={{fontWeight:"bold",fontSize:18}}>{steps[active-1].content}</Text>
            <Pressable onPress={()=>{
            }}><Text>Proceed</Text></Pressable>
            </View>
            <View style={{flex:1,backgroundColor:'white'}}>
                <View style={{flex:0.22,borderRadius:3,borderWidth:1,borderColor:'#D0D0D0',marginHorizontal:20,paddingHorizontal:10,paddingVertical:10,marginBottom:10}}>
                    <Text style={{color:"grey",fontSize:17,marginBottom:5}}>Shipping to {userName}</Text>
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>Items</Text>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>${cartCost}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>Delivery</Text>
                        <Text style={{fontSize:16,color:'#B7B7B7'}}>${deliveryCost}</Text>
                    </View>
                    {/* C60C30 */}
                    <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:5}}>
                        <Text style={{fontSize:20,fontWeight:"bold"}}>Total </Text>
                        <Text style={{fontSize:16,color:'#C60C30',fontWeight:"800"}}>${totalCost}</Text>
                    </View>
                </View>
                <View style={{marginHorizontal:20,borderWidth:1,borderColor:"#B7B7B7",borderRadius:3,paddingHorizontal:10,paddingVertical:10}}>
                    <Text style={{color:'grey'}}>Pay With</Text>
                    <Text>{paymentMethod}</Text>
                </View>
            </View>
            {/* <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10}}>Your Cart</Text> */}
            <View style={{flex:1,marginTop:10,marginLeft:10}}>
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
          );
        }}
      />
      </View>
            </ScrollView>
      <View style={{backgroundColor:"white",padding:5,paddingBottom:10}}>
        <Pressable onPress={checkoutHandler} style={{alignItems:'stretch',backgroundColor:'#ffc72c',paddingHorizontal:10,paddingVertical:7,justifyContent:"center"}}>
          <Text style={{fontSize:18,fontWeight:"400",alignSelf:"center"}}>Proceed to payment</Text>
        </Pressable>
      </View>
            </>
        )
    }
    const navigation=useNavigation();
    useFocusEffect(useCallback(()=>{
        const sub=BackHandler.addEventListener("hardwareBackPress",()=>{
            if(active<=1){
                navigation.goBack();
                return false;
            }
            else if(active>1){
                setActive((prev)=>prev-1);
                return true
            }
        })
        return ()=>sub.remove()
    },[active]))
  return (
    <SafeAreaView style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 0,
        backgroundColor: "white",
      }}>
        <View style={{flexDirection:"row",gap:10,alignItems:"center",marginBottom:10,marginLeft:10}}>
        <Ionicons name="chevron-back-sharp" size={24} color="black" style={{top:2}} onPress={()=>navigation.goBack()} />
        <Text style={{fontSize:22}}>Checkout</Text>
        </View>
         <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:'center',padding:16}}>
            {steps.map((step,idx)=>{
                let page=idx+1;
                return(
                    <View style={{alignItems:'center'}}>
                <Pressable onPress={()=>{
                    if(page<active){
                        setActive(page);
                    }
                }} style={{borderRadius:50,backgroundColor:active>page?'green':'#B7B7B7',height:50,width:50,justifyContent:'center',alignItems:'center'}}>
                    {active>page?
                    <MaterialIcons name="done" size={20} color="white" />
                    :<Text style={{color:"white",fontWeight:"bold"}}>{idx+1}</Text>}
                </Pressable>
                <Text style={{fontSize:12,marginTop:3}}>{step.title}</Text>
            </View>
                )
            })}
         </View>
         <View style={{flex:1}}>
            {/* <PlaceOrder/> */}
            {active==1?<SelectAddress setActive={setActive} setDeliveryAddress={setDeliveryAddress} active={active} steps={steps} deliveryAddress={deliveryAddress} />:<></>}
            {active==2?<DeliveryOption/>:<></>}
            {active==3?<PaymentMethod/>:<></>}
            {active==4?<PlaceOrder/>:<></>}
            {active==5?<Confirmation/>:<></>}
         </View>
    </SafeAreaView>
  )
}
function Confirmation(){
  const navigation=useNavigation();
  const ref=useRef();
  useLayoutEffect(()=>{
    ref.current.play();
    setTimeout(()=>{
      navigation.navigate('main');
    },5000)
  },[])
  return(
    <View style={{backgroundColor:"white",alignItems:"center"}}>  
      <LottieView source={require("../../Worker.json")} ref={ref} autoPlay={true} loop={true} style={{height:350,width:350}}/>
      <Text style={{textAlign:"center",fontWeight:'500',fontSize:22}}>Order Confirmed</Text>
    </View>
  )
}
function SelectAddress({steps,active,setActive,setDeliveryAddress,deliveryAddress}){
    const flatlistRef=useRef();
    const {addresses,userId,defaultAddress,userName}=useSelector(state=>state.user)
    return(
        <>
        <View style={{flexDirection:"row",justifyContent:"space-between",marginHorizontal:10,marginBottom:5}}>
        <Text style={{fontWeight:"bold",fontSize:18}}>{steps[parseInt(active)].content}</Text>
        <Pressable  style={{paddingHorizontal:10,paddingVertical:5,borderRadius:16,backgroundColor:deliveryAddress?"#ffc72c":"#eaeaea"}} onPress={()=>{
            if(deliveryAddress){
                setActive((active)=>active+1)
            }
        }}><Text>Proceed</Text></Pressable>
        </View>
        <FlatList data={addresses} ref={flatlistRef} renderItem={({item,index})=>{
            return(
                <View style={{flexDirection:'row',flex:1,alignItems:"center"}}>
                    <View style={{flex:0.2,justifyContent:"center",alignItems:'center'}}>
                        {(deliveryAddress&&deliveryAddress.addressID==item.addressID)?<MaterialIcons name="radio-button-on" size={24} color="#008397"/>:<MaterialIcons name="radio-button-off" size={24} color="#008397" onPress={()=>setDeliveryAddress(item)} />}
                    </View>
                    <View style={{flex:0.8}}>
                    <View style={{
        borderWidth:1,
        borderColor:'#D0D0D0',
        padding:10
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
        <Pressable style={{
          borderWidth:1,
          borderColor:'#D0D0D0',
          padding:5,
          paddingHorizontal:10
        }}>
          <Text>Edit</Text>
        </Pressable>
        <Pressable style={{
          borderWidth:1,
          borderColor:'#D0D0D0',
          padding:5,
          paddingHorizontal:10
        }}>
          <Text>Remove</Text>
        </Pressable>
        <Pressable style={{
          borderWidth:1,
          borderColor:'#D0D0D0',
          padding:5,
          paddingHorizontal:10
        }}>
          <Text>Delete</Text>
        </Pressable>
        {(defaultAddress!=undefined&&defaultAddress.addressID!=item.addressID)?<Pressable style={{
          borderWidth:1,
          borderColor:'#D0D0D0',
          padding:5,
          paddingHorizontal:10
        }}>
          <Text>Set as default</Text>
        </Pressable>:<></>}
      </View>
        </View>
                    </View>
                </View>
            )
        }}/>
        </>
    )
}

export default CheckoutScreen

const styles = StyleSheet.create({})