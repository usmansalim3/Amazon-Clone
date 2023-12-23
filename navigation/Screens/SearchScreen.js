import { SafeAreaView, StyleSheet, Text, View,TextInput, Image, Pressable, FlatList, LogBox, ScrollView, Keyboard,Platform,StatusBar, Dimensions } from 'react-native'
import React,{useState,useEffect, useLayoutEffect} from 'react'
import { Ionicons,AntDesign } from "@expo/vector-icons";
import { BottomModal, ModalContent, ModalTitle, SlideAnimation } from "react-native-modals";
import { AirbnbRating } from 'react-native-ratings';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import MemoizedFilterModal from '../../components/MemoizedFilterModal';
import { setCategory, setProducts } from '../../redux/ProductsReducer';
import { useNavigation, useRoute } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { link } from '../../data/data';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import MemoizedCategoriesScroll from '../../components/MemoizedCategoriesScroll';
import { verticalScale } from 'react-native-size-matters';
LogBox.ignoreAllLogs(true);

const SearchScreen = () => {
    const navigation=useNavigation()
    const dispatch=useDispatch();
    const route=useRoute()
    const {from,to,orderBy,rating,products,category}=useSelector(state=>state.products)
    const [loading,setLoading]=useState(false)
    const [page,setPage]=useState(1);
    useLayoutEffect(()=>{
      console.log("calling effect of search")
      getProducts();
    },[from,to,rating,category,orderBy])
    async function getProducts(){
      console.log("calling from search")
      try{
        setLoading(true);
        console.log(category,rating)
        const {data}=await axios.post(`${link}/products/filter`,{
          limit:10,
          lowest:from,
          highest:to,
          stars:rating>0?rating:null,
          category:category?category:""
        });
        dispatch(setProducts([...data.products]))
        setLoading(false);
      }catch(e){
        console.log(e)
      }
    }
  return (
    <SafeAreaView style={{
        flex:1,
        backgroundColor:'white'
    }}>
      <CollapsibleHeaderScrollView headerHeight={Platform.OS=='android'?120:95} statusBarHeight={-50} CollapsibleHeaderComponent={<>
          <View
            style={{
              backgroundColor: "#00CED1",
              width: "100%",
              padding: 10,
              paddingTop:Platform.OS=='android'?StatusBar.currentHeight+5:StatusBar.currentHeight,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                padding: 5,
                alignItems: "center",
                elevation: 5,
                borderRadius:4,
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
                value={category}
                //onChangeText={category}
                style={{ backgroundColor: "white", width: "90%",fontSize:16 }}
              />
            </View>
            <Ionicons
              name="mic-outline"
              size={26}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </View>
          <View style={{
              backgroundColor: "#AFEEEE",
              width:'100%',
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor:'#B7B7B7',
              borderBottomWidth:0.5,
              justifyContent:"space-between",
            }}>
              <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
              <Image
                      style={{ width: 45, height: 40, resizeMode: "contain" }}
                      source={{
                        uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                      }}
              />
              </View>

              <View style={{flex:0.8}}>
                <MemoizedCategoriesScroll getProducts={getProducts}/>
              </View>

              <View style={{flex:0.2}}>
                <MemoizedFilterModal/>
              </View>
          </View >
          </>}>
            <FlatList data={products.length?products:[1,2,3,4]} style={{marginTop:10}} numColumns={2} onEndReachedThreshold={0.5} onEndReached={()=>{
              console.log("reached");
              setPage(page+1);
            }} renderItem={({item})=>{
              if(loading){
                return(
                  <Skeleton/>
                )
              }
              return(
                <Pressable onPress={()=>{
                  navigation.navigate("SingleProduct", {
                    productDetails: item,
                  })
                }} style={{width:"50%",height:350,borderColor:"#D0D0D0",borderWidth:0.5,padding:5,paddingBottom:0}}>
                  <View style={{flex:0.5}}>
                    <Image source={{uri:item.image}} style={{resizeMode:"contain",height:150,width:150,alignSelf:'center'}}/>
                  </View>
                  <View style={{flex:0.3}}>
                    <Text numberOfLines={2} style={{fontWeight:'500',marginVertical:5}}>{item.title}</Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={{
                          uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                        }}
                    />
                    <View>
                    <AirbnbRating
                              showRating={false}
                              ratingContainerStyle={{ flexDirection:"row",bottom:0,marginRight:10 }}
                              count={item.rating?.rate}
                              defaultRating={11}
                              size={12}
                              />
                    </View>
                    
                    </View>
                    <Text style={{fontSize:20,fontWeight:'500',marginBottom:10}}>${item.price}</Text>
                  </View>
                  <View style={{flex:0.2,justifyContent:"center",alignItems:'stretch'}}>
                  <Pressable onPress={() =>
                          navigation.navigate("SingleProduct", {
                            productDetails: item,
                          })} style={{backgroundColor:'#FFC72C',padding:10,borderRadius:20}}>
                    <Text style={{textAlign:'center'}}>Add to cart</Text>
                  </Pressable>
                  </View>
                </Pressable>
              )
            }} />
            </CollapsibleHeaderScrollView>
    </SafeAreaView>
  )
}

function Skeleton(){
  return(
    <View style={{width:"50%",height:350,borderColor:"#D0D0D0",borderWidth:0.7,padding:5,paddingBottom:0}}>
    <View style={{flex:0.7,backgroundColor:"#D0D0D0",marginBottom:10}}>
      <Text></Text>
    </View>
    <View style={{flex:0.2,marginLeft:0,backgroundColor:"#D0D0D0",marginBottom:5}}>
  
    </View>
    <View>
      
    </View>
    <View style={{flex:0.1,backgroundColor:"#D0D0D0",marginBottom:3}}>
    </View>
  </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})
