import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import { useFormik } from 'formik';
import * as yup from 'yup'
import "yup-phone";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { editAddress, updateAddress } from '../../redux/UserReducer';
import { link } from '../../data/data';
import {Ionicons} from "@expo/vector-icons"


const AddAddress = () => {
  const navigation=useNavigation();
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false)
  const {userId}=useSelector(state=>state.user)
  const [item,setItem]=useState({
        country:"India",
        name:"",
        houseNo:"",
        landmark:"",
        postalCode:"",
        street:"",
        mobileNo:"",
        city:""
  })
  const route=useRoute();
  useLayoutEffect(()=>{
    console.log(route.params?.edit)
    console.log(route.params?.addressID)
    if(route.params?.address){
        const address=route.params.address
        formik.setValues({
            country:address.country,
            name:address.name,
            houseNo:address.houseNo,
            landmark:address.landmark,
            postalCode:address.postalCode,
            street:address.street,
            mobileNo:address.mobileNo,
            city:address.city
        })
    }else{
        console.log("nah")
    }
  },[])
  const formik=useFormik({
    initialValues:item,
    validationSchema:yup.object().shape({
        name:yup.string().min(3,"Too short!").max(30,"Name length limited reached!").required("Email is required!"),
        mobileNo:yup.string().required("Required").min(10,"invalid"),
        houseNo:yup.string().required("required"),
        landmark:yup.string().required("required"),
        postalCode:yup.string().required("Postal code is required"),
        city:yup.string().required("city is required"),
        country:yup.string().required()
    }),
    onSubmit:(values)=>{
        addAddress();
    }
  })
  async function addAddress(){
    try{
        setLoading(true)
        const address={
            name:formik.values.name,
            mobileNo:formik.values.mobileNo,
            houseNo:formik.values.houseNo,
            city:formik.values.city,
            postalCode:formik.values.postalCode,
            country:formik.values.country,
            landmark:formik.values.landmark,
            street:formik.values.street
        }
        if(route.params?.address){
            address.addressID=route.params.address.addressID
        }
        const res=await axios.post(`${link}/addresses`,{
            userId,
            address,
            editing:route.params?.edit?true:false,
            addressID:route.params?.addressID
        }) 
        console.log(res.data);
        if(route.params?.edit){
            dispatch(editAddress({address,addressID:route.params.addressID}))
        }else{
            address.addressID=res.data.addressID;
            dispatch(updateAddress(address))
        }
        navigation.dispatch(StackActions.pop());
    }catch(e){
        console.log(e);
    }finally{
        setLoading(false);
    }
  }
  return (
    <SafeAreaView style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? 40 : 0,
        backgroundColor:'white'
      }}>
        <Spinner visible={loading}/>
        <ScrollView>
        <View style={{flexDirection:"row",gap:10,alignItems:"center",marginBottom:10,marginLeft:10}}>
        <Ionicons name="chevron-back-sharp" size={24}  color="black" style={{}} onPress={()=>navigation.goBack()} />
        <Text style={{fontSize:24}}>Add New Address</Text>
        </View>
        <View style={{flex:1,backgroundColor:"white",paddingHorizontal:20,gap:5}}>
            <Text style={{fontWeight:'bold',fontSize:15,}}>Country</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.country&&formik.errors.country)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='India'  onChangeText={formik.handleChange('country')} onBlur={formik.handleBlur('country')} value={formik.values.country}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15}}>Full Name</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.name&&formik.errors.name)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='Enter your name' onChangeText={formik.handleChange('name')} onBlur={formik.handleBlur('name')} value={formik.values.name}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15,}}>Mobile Number</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.mobileNo&&formik.errors.mobileNo)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='Enter Number' onChangeText={formik.handleChange('mobileNo')} keyboardType='number-pad' onBlur={formik.handleBlur('mobileNo')} value={formik.values.mobileNo}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15,}}>Flat,House No,Building No </Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.houseNo&&formik.errors.houseNo)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='Enter details' onChangeText={formik.handleChange('houseNo')} onBlur={formik.handleBlur('houseNo')} value={formik.values.houseNo}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15,}}>Area,Street,Sector,Village</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:'#B7B7B7'}}>
            <TextInput placeholder='nearby area' onChangeText={formik.handleChange('street')} onBlur={formik.handleBlur('street')} value={formik.values.street}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15,}}>Landmark</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.landmark&&formik.errors.landmark)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='e.g near Apollo Hospital' onChangeText={formik.handleChange('landmark')} onBlur={formik.handleBlur('landmark')} value={formik.values.landmark}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15,}}>City</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.city&&formik.errors.city)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='Enter City' onChangeText={formik.handleChange('city')} onBlur={formik.handleBlur('city')} value={formik.values.city}/>
            </View>
            <Text style={{fontWeight:'bold',fontSize:15,}}>Area Pincode</Text>
            <View style={{borderWidth:0.5,padding:5,borderRadius:3,borderColor:(formik.touched.postalCode&&formik.errors.postalCode)?'#E57373':'#B7B7B7'}}>
            <TextInput placeholder='Pincode' onChangeText={formik.handleChange('postalCode')} onBlur={formik.handleBlur('postalCode')} keyboardType='phone-pad' value={formik.values.postalCode}/>
            </View>
            <Pressable onPress={formik.handleSubmit} style={{padding:10,backgroundColor:"#ffc72c",borderRadius:3,marginTop:50,height:50,justifyContent:'center',alignItems:'center'}}>
                <Text style={{textAlign:"center",fontWeight:'400'}}>
                    {route.params?.edit?"Edit":"Add"} Address
                </Text>
            </Pressable>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default AddAddress

const styles = StyleSheet.create({})