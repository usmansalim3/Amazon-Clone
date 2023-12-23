import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign,Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from 'yup'
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { loggedIn } from "../../redux/UserReducer";
import Spinner from 'react-native-loading-spinner-overlay';
import Modal, {
  ModalButton,
ModalContent,
ModalFooter,
ModalTitle,
} from "react-native-modals";
import { link } from "../../data/data";
import { setCart } from "../../redux/CartReducer";

const LoginScreen = () => {
  const dispatch=useDispatch();
  const [visible,setVisible]=useState(false)
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const formik=useFormik({
    initialValues:{
        email:"",
        password:"",
    },
    validationSchema:yup.object().shape({
        email:yup.string().min(3,"Too short!").max(30,"Name length limited reached!").required("Email is required!").email("Enter a valid email"),
        password:yup.string().min(3,"Too short!").max(20,"Name length limited reached!").required("Password is required!")
    }),
    onSubmit:(values)=>{
        login()
        
    }
  })
  async function login(){
    try{
        setLoading(true);
        const res=await axios.post(`${link}/login`,{
            email:formik.values.email,
            password:formik.values.password
        })
        console.log(res)
        const decodedJWT=jwtDecode(res.data.token)
        console.log(decodedJWT)
        const userData=await axios.get(`${link}/profile/${decodedJWT.userId}`);
        const cartData=await axios.get(`${link}/cart/getCart/${decodedJWT.userId}`);
        const orderData=await axios.get(`${link}/orders/${decodedJWT.userId}`);
        const {user}=userData.data
        const {orders}=orderData.data
        const {cart}=cartData.data
        dispatch(loggedIn({userId:user._id,userName:user.name,addresses:user.addresses,orders}))
        dispatch(setCart(cart));
        AsyncStorage.setItem("token",JSON.stringify(res.data));
        setLoading(false)
        navigation.dispatch(StackActions.replace('HomeTabs'))
    }catch(e){
      console.log(e.response.data.message);
        setError(e.response.data.message);
        setLoading(false)
    }
  }
  const navigation=useNavigation();
  return (
    <>
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 0,
        backgroundColor: "white",
      }}
    >
      <Spinner visible={loading}/>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ width: 180, height: 80, marginTop: 30 }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          letterSpacing: 0.4,
        }}
      >
        Login to your account
      </Text>

      <KeyboardAvoidingView style={{ marginTop: 110 }} contentContainerStyle={{marginBottom:20}} behavior={Platform.OS==='android'?'position':'padding'}>
        <View
          style={{
            borderRadius: 5,
            backgroundColor:"#D0D0D0",
            flexDirection: "row",
            width: "80%",
            alignSelf: "center",
            padding: 10,
            gap: 5,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="email" size={24} color="grey" />
          <TextInput placeholder="Enter Email" style={{fontSize:16,width:'85%'}} value={formik.values.email} onChangeText={formik.handleChange('email')} onBlur={formik.handleBlur('email')} />
        </View>
        {/* <View
          style={{
            borderRadius: 5,
            backgroundColor: "#D0D0D0",
            flexDirection: "row",
            width: "80%",
            alignSelf: "center",
            marginTop: 23,
            padding: 10,
            gap: 5,
            alignItems: "center",
          }}
        >
          <AntDesign name="lock" size={24} color="grey" />
          <TextInput secureTextEntry={visible} placeholder="Enter password" style={{fontSize:16,width:'85%'}} value={formik.values.password} onChangeText={formik.handleChange('password')} onBlur={formik.handleBlur('password')} />
          <View>
            <Feather name={visible?"eye":"eye-off"} onPress={()=>setVisible(vis=>!vis)} size={20} color="grey" style={{right:3}} />
          </View>
        </View> */}
        <View
          style={{
            borderRadius: 5,
            backgroundColor:"#D0D0D0",
            flexDirection: "row",
            width: "80%",
            alignSelf: "center",
            marginTop: 23,
            padding: 10,
            gap: 5,
            alignItems: "center",
            justifyContent:'space-between'
          }}
        >
          <View style={{flexDirection:"row",alignItems:"center",gap:5}}>
          <AntDesign name="lock" size={24} color="grey" />
          <TextInput
            secureTextEntry={!visible}
            placeholder="Enter password"
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            style={{ fontSize: 16,width:"80%" }}
          />
          </View>
          <View>
            <Feather name={visible?"eye":"eye-off"} onPress={()=>setVisible(vis=>!vis)} size={20} color="grey" style={{right:3}} />
          </View>
        </View>
        <View style={{width:'80%',alignSelf:'center'}}>
        <Text style={{textAlign:'right',marginTop:5,color:'#007FFF'}}>Forgot password?</Text>
        </View>
        <Pressable
            onPress={()=>formik.handleSubmit()}
            style={{
            padding: 10,
            backgroundColor: "#ffc72c",
            borderRadius: 3,
            marginTop: 25,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            width:'80%',
            alignSelf:'center'
            }}
        >
            <Text style={{ textAlign: "center", fontWeight: "400",fontSize:16,color:'white' }}>LOGIN</Text>
        </Pressable>
        <Pressable onPress={()=>navigation.navigate('register')}>
            <View style={{flexDirection:'row',alignSelf:'center',marginTop:5}}>
                <Text style={{color:"#B7B7B7"}}>Don't have an account?</Text>
                <Text style={{color:"#B7B7B7"}}> Sign Up here</Text>
            </View>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
      <Modal visible={error?true:false} modalTitle={<ModalTitle title="Something went wrong"/>}
      footer={
        <ModalFooter>
            <ModalButton onPress={()=>{
              setError("")
            }} text="OK"/>
        </ModalFooter>
      }
      >
        <ModalContent>
          <View style={{justifyContent:'center',alignItems:'center',top:10}}>
          <Text style={{fontSize:16,justifyContent:'center',alignItems:'center',textAlign:'center'}} numberOfLines={2}>{error}</Text>
          </View>
        </ModalContent>
      </Modal>
      </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
