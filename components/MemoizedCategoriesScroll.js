import { SafeAreaView, StyleSheet, Text, View,TextInput, Image, Pressable, FlatList, LogBox, ScrollView, Keyboard,Platform,StatusBar } from 'react-native'
import React,{useState,useEffect, useLayoutEffect, memo} from 'react'
import { setCategory } from '../redux/ProductsReducer';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
LogBox.ignoreAllLogs(true);

const CategoriesScroll = ({getProducts}) => {
    console.log("refresh")
    const categories=useMemo(()=>[
        "electronics",
        "jewelery",
        "men's clothing",
        "women's clothing"
    ],[])
    const dispatch=useDispatch();
  return (
    <ScrollView horizontal  contentContainerStyle={{paddingVertical:5}} showsHorizontalScrollIndicator={false}>
                        <Pressable onPress={()=>{
                              dispatch(setCategory(""))
                              //getProducts()
                              }} style={{paddingHorizontal:10,paddingVertical:7,borderRadius:3,marginHorizontal:5,backgroundColor:"#00CED1"}}>
                              <Text style={{textAlign:'center',fontSize:15,color:'white'}}>All</Text>
                            </Pressable>
                        {categories.map((category)=>{
                          return(
                            <Pressable onPress={()=>{
                              dispatch(setCategory(category))
                              // getProducts()
                              }} style={{paddingHorizontal:5,paddingVertical:7,borderRadius:3,marginHorizontal:5,backgroundColor:"#00CED1"}}>
                              <Text style={{textAlign:'center',fontSize:15,color:'white'}}>{category}</Text>
                            </Pressable>
                          )
                        })}
          </ScrollView>
  )
}

export default memo(CategoriesScroll)

const styles = StyleSheet.create({})