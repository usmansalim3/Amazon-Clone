import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { deals, images, item, list, offers } from "../../data/data";
import { Ionicons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import { AirbnbRating, Rating } from "react-native-ratings";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import MemoizedBottomModal from "../../components/MemoizedModal";
import { setCategory as setCategoryReducer } from "../../redux/ProductsReducer";
import { CollapsibleHeaderScrollView } from "react-native-collapsible-header-views";
import Animated, { Easing, FadeIn, FadeInDown, FadeInLeft, SlideInLeft } from "react-native-reanimated";


function Wrapper({children}){
  const navigation=useNavigation();
  return(
    <>
    <CollapsibleHeaderScrollView nestedScrollEnabled headerHeight={Platform.OS=='android'?120:95} statusBarHeight={-45} CollapsibleHeaderComponent={()=>{
          return(
            <View style={{backgroundColor:'black'}}>
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
                editable={false}
                onTouchStart={()=>navigation.navigate('search')}
                style={{ backgroundColor: "white", width: "90%",fontSize:16 }}
              />
            </Pressable>
            <Ionicons
              name="mic-outline"
              size={26}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </View>
          <MemoizedBottomModal/>
            </View>
          )
        }}>

    <FlatList
	  data={[{}]}
	  renderItem={() => {return(<>
    {children}
    </>)}}
    />
    </CollapsibleHeaderScrollView>
    </>
  )
}
const LandingScreen = () => {
  const[height,setHeight]=useState(0);
  const navigation = useNavigation();
  const dispatch=useDispatch();
  const {userName,addresses,userId}=useSelector((state)=>state.user);
  useEffect(() => {
    getProducts(5);
  }, []);
  const [products, setProducts] = useState([]);
  const [loading,setLoading]= useState(false);
  const [page,setPage]=useState(1);
  async function getProducts(limit) {
    setLoading(true)
    const res = await axios.get(`https://fakestoreapi.com/products?limit=${limit}`);
    setProducts(res.data);
    setLoading(false)
  }
  //console.log(StatusBar.currentHeight,"hieght")
  const RPH = useCallback((percentage) => {
    return (percentage / 100) * Dimensions.get('screen').height;
  }, []);
  return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:'white'
        }}
      >
    <Wrapper>  
          <View style={{ paddingTop: 5 }}>
            <Animated.FlatList
              entering={FadeInLeft.duration(800)}
              horizontal
              data={list}
              style={{marginTop:10}}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <Pressable onPress={()=>{
                    dispatch(setCategoryReducer(item.query))
                    navigation.navigate('search',{query:item.query})
                  }} style={{ alignItems: "center" }}>
                    <Image
                      
                      source={{ uri: item.image }}
                      style={{
                        height: 55,
                        width: 55,
                        marginHorizontal: 10,
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={{ fontSize: 12, marginVertical: 5 }}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
          <SliderBox
            images={images}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          />
          <ScrollView nestedScrollEnabled>
            <Text style={{ fontSize: 18, fontWeight: "bold", margin: 5 }}>
              Trending deals of the week
            </Text>
            <Animated.FlatList
              entering={FadeInDown.duration(800)}
              data={deals}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  <Animated.View style={{flex:1}} >
                  <Pressable style={{flex:1}} onPress={()=>navigation.navigate('SingleProduct',{
                    productDetails:item
                  })}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: 200, resizeMode: "contain" }}
                    />
                  </Pressable>
                  </Animated.View>
                );
              }}
            />
          </ScrollView>
          <Text
            style={{
              height: 0.8,
              borderColor: "#D0D0D0",
              borderWidth: 0.5,
              marginVertical: 5,
            }}
          />
          <ScrollView>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 5,
                marginBottom: 5,
              }}
            >
              Today's Deals
            </Text>
            <FlatList
              data={offers}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 120, height: 120, resizeMode: "contain" }}
                    />
                    <View
                      style={{
                        paddingVertical: 5,
                        marginVertical: 10,
                        backgroundColor: "#E31837",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "wheat",
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        {item.offer}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </ScrollView>
          <Text
            style={{
              height: 0.8,
              borderColor: "#D0D0D0",
              borderWidth: 0.5,
              marginVertical: 0,
            }}
          />
          <Text style={{fontSize:18,marginLeft:5,fontWeight:"bold"}}>Products on sale</Text>
          <View style={{ marginTop: 5, width: "85%", alignSelf: "center" }}>
            {/* <DropDownPicker
              style={{
                marginBottom: open ? 180 : 20,
                height: 50,
                borderColor: "#B7B7B7",
              }}
              dropDownContainerStyle={{ borderColor: "#B7B7B7" }}
              open={open}
              setOpen={() => setOpen(true)}
              items={item}
              value={category}
              setValue={setCategory}
              onClose={() => setOpen(false)}
              placeholder="Choose Category"
              closeOnBackPressed={true}
            /> */}
            {/* <MemoizedDropDownPicker category={category} setCategory={setCategory}/> */}
          </View>

            <FlatList
              data={products}
              numColumns={2}
              ListFooterComponent={loading?()=>{
                return(
                  <View style={{flex:1}}>
                    <ActivityIndicator size='large' animating={true}/>
                  </View>
                )
              }:()=><></>}
              renderItem={({ item }) => {
                return (
                  <Pressable onPress={() =>
                    navigation.navigate("SingleProduct", {
                      productDetails: item,
                    })
                  } style={{height:300,width:'50%',padding:5}}>
                    <View style={{flex:0.6,justifyContent:"center",alignItems:'center'}}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                          resizeMode: "contain",
                          width: 150,
                          height: 150,
                          marginBottom: 5,
                          alignSelf: "center",
                        }}
                      />
                    </View>
                    <View style={{flex:0.2,marginHorizontal:10}}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 13,
                          fontWeight: "bold",
                        }}
                      >
                        {item.title}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems:'center',
                          marginTop:3
                        }}
                      >
                        <Text>${item.price}</Text>
                        <View>
                          <AirbnbRating
                            isDisabled
                            showRating={false}
                            count={item.rating.rate}
                            defaultRating={11}
                            size={12}
                          />
                        </View>
                      </View>

                    </View>
                    <View style={{flex:0.2,justifyContent:"center",alignItems:"center"}}>
                    <Pressable
                        onPress={() =>
                          navigation.navigate("SingleProduct", {
                            productDetails: item,
                          })
                        }
                        style={{
                          backgroundColor: "#FFC72C",
                          padding: 10,
                          marginTop: 10,
                          borderRadius: 25,
                          width: "85%",
                        }}
                        >
                        <Text style={{ textAlign: "center" }}>Add to Cart</Text>
                      </Pressable>
                    </View>
                    </Pressable>

                );
              }}
            />
        {/* </ScrollView> */}
        {/* </CollapsibleHeaderScrollView> */}
    </Wrapper>
      </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({});
