import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Pressable,
  Dimensions,
  TextInput,
  StatusBar,
  TouchableNativeFeedback,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import UserAvatar from 'react-native-user-avatar';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFooter, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput, TouchableOpacity } from "@gorhom/bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import { SliderBox } from "react-native-image-slider-box";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { AirbnbRating } from "react-native-ratings";
import { Ionicons,Octicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { addToCart,removeFromCart } from "../../redux/CartReducer";
import axios from "axios";
import { addWish } from "../../redux/UserReducer";
import { link } from "../../data/data";
import Carousel from "react-native-reanimated-carousel";
import { FlatList } from "react-native-gesture-handler";
import { nanoid } from "@reduxjs/toolkit";
import ImageView from "react-native-image-viewing";
import { StatusBar as expoBar } from 'expo-status-bar';


const SingleProductScreen = () => {
  const route = useRoute();
  const dispatch=useDispatch();
  const[reviews,setReviews]=useState([]);
  const[vis,setVis]=useState(false)
  const [activeIndex,setActiveIndex]=useState(0);
  const {cart}=useSelector(state=>state.cart);
  const userId=useSelector(state=>state.user.userId);
  const userName=useSelector(state=>state.user.userName)
  const defaultAddress=useSelector(state=>state.user.defaultAddress)
  const wishlist=useSelector(state=>state.user.wishlist)
  const { image, description, title, price, rating,id,offer,carouselImages } = route.params.productDetails;
  const [inCart,setInCart]=useState(false);
  const [inWish,setInWish]=useState(false);
  const [loadingReviews,setLoadingReviews]=useState(false);

  useEffect(()=>{
    getReviews();
    async function getReviews(){
      console.log("callinng")
      const {data}=await axios.get(`${link}/reviews/${id}`);
      console.log(data)
      setReviews([...data.result]);
    }
  },[])

  async function addToWishlist(item){
    try{
      const {data}=await axios.post(`${link}/wishlist/add`,{
        userId,
        item
      })
      console.log(data)
      if(data.success){
        console.log("adding")
        dispatch(addWish(item))
      }
      setInWish(true)
    }catch(e){
      console.log(e)
    }
  }
  const [uriImage,setUriImage]=useState("");
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      base64:true
    });
    await Promise.all(result.assets.forEach(async(res)=>{
      await uploadImage(res.base64);
    }))
  };
  async function removeFromWish(id){
    try{
      await axios.get(`${link}/wishlist/remove/`,{
        params:{
          userId,
          itemId:route.params.productDetails.id
        }
      })
      dispatch(removeFromWish(id))
      setInWish(false);
    }catch(e){
      console.log(e)
    }
  }

  async function addToCartHandler(){
    console.log('adding',id)
    let itemToAdd=route.params.productDetails;
    itemToAdd.quantity=1;
    const res=await axios.post(`${link}/cart/add`,{
      userId,
      item:itemToAdd
    })
    console.log(res.data);
    dispatch(addToCart(route.params.productDetails));
  }

  async function removeFromCartHandler(){
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
  useLayoutEffect(()=>{
    const isAdded=cart?.find((item)=>item.id==id)
    const isInWishlist=wishlist?.find(wish=>wish.id==route.params.productDetails.id)
    if(isAdded){
      setInCart(true);
    }else{
      setInCart(false)
    }
    if(isInWishlist){
      setInWish(true)
    }else{
      setInWish(false)
    }
  },[dispatch,cart,wishlist])
  const navigation=useNavigation()
  const width = Dimensions.get('window').width;
  return (
    <SafeAreaView
    style={{
      flex: 1,
      backgroundColor:"white"
      }}
      >
        <ScrollView>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:"#00CED1",paddingHorizontal:10,paddingVertical:10,paddingTop:StatusBar.currentHeight+5}}>
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
                value={""}
                //onChangeText={category}
                onTouchStart={()=>navigation.navigate('search')}
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
      {/* <View>
      {offer?<View
              style={{
                backgroundColor: "#C60C30",
                position: "absolute",
                borderRadius: 40,
                width: 40,
                height: 40,
                left: 10,
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                top:30,
                zIndex:10
              }}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 13 }}
              >
                {offer}
              </Text>
            </View>:<></>}
            <View
              style={{
                position: "absolute",
                bottom: 30,
                left: 10,
                padding: 8,
                backgroundColor: "#B7B7B7",
                borderRadius: 20,
                zIndex:10
              }}
            >
              <AntDesign onPress={()=>{
                if(inWish){
                  removeFromWish(route.params.productDetails.id)
                }else{
                  addToWishlist(route.params.productDetails)
                }
              }} name={inWish?"heart":"hearto"} size={22} color="black" />
            </View>
            <View style={{position:"absolute",bottom:25,alignSelf:"center",flexDirection:"row",gap:5}}>
              {carouselImages.map((image,index)=>{
                return(
                  <Octicons name={activeIndex==index?"dot-fill":"dot"} size={16} color="black" />
                  )
                })}
            </View>
          <Carousel
                width={width}
                height={width}
                data={carouselImages?carouselImages:[image]}
                scrollAnimationDuration={1000}
                onSnapToItem={(index)=>setActiveIndex(index)}
                renderItem={({ index,item }) => (
                  <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                  <ImageBackground
                  source={{ uri: item }}
                  resizeMode='contain'
                  style={{
                    height: 300,
                    width: "100%",
                    alignSelf: "center"
                  }}>

                  </ImageBackground>
                  </View>
                )}
            />
            </View> */}
            <CarouselComponent image={image} carouselImages={carouselImages} inWish={inWish} width={width} addToWishlist={addToWishlist} offer={offer} removeFromWish={removeFromWish}/>
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              width: "80%",
              marginVertical: 5,
              fontWeight: "bold",
              fontSize: 15,
            }}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={{ width: "90%" }} numberOfLines={4}>
            {description}
          </Text>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>${price}</Text>
            <AirbnbRating
              ratingContainerStyle={{ height:0.1,bottom:10,marginRight:10}}
              isDisabled={true}
              count={5}
              defaultRating={rating.rate}
              size={20}
            />
          </View>
          <View style={{flexDirection:"row",alignItems:'center',justifyContent:"space-between",marginRight:10}}>
            <Image
                      style={{ width: 40, height: 30, resizeMode: "contain" }}
                      source={{
                        uri: "https://assets.stickpng.com/thumbs/5f4924cc68ecc70004ae7065.png",
                      }}
                    />
            <Text style={{color:'green',fontWeight:'500'}}>In Stock</Text>
          </View>
          <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
            <Ionicons name="location" size={24} color="#b7b7b7" style={{right:5}} />
            <Text>
              Deliver to {defaultAddress?.name?defaultAddress?.name:"Choose an address"} - {defaultAddress?.city?defaultAddress?.city:""} {defaultAddress?.postalCode?defaultAddress?.postalCode:""}
            </Text>
          </View>
        </View>
        <View style={{marginTop:'10%',marginBottom:10}}>
          <Pressable onPress={inCart?removeFromCartHandler:addToCartHandler} style={{padding:10,borderRadius:20,backgroundColor:"#ffc72c",justifyContent:'center',alignItems:'center',width:'90%',alignSelf:'center',marginVertical:10}}>
            {inCart?<Text style={{fontWeight:500}}>Added to cart</Text>:<Text style={{fontWeight:500}}>Add to cart</Text>}
          </Pressable>
          <Pressable style={{padding:10,borderRadius:20,backgroundColor:"#ffc72c",justifyContent:'center',alignItems:'center',width:'90%',alignSelf:'center'}}>
            <Text style={{fontWeight:500}}>Buy Now</Text>
          </Pressable>
        </View>
        <View style={{flexDirection:'row',justifyContent:"space-between",marginHorizontal:10,alignItems:"center"}}>
        <Text style={{fontSize:22}}>Reviews</Text>
        <ReviewModal vis={vis} setVis={setVis} setReviews={setReviews} userId={userId} userName={userName} id={id}/>
        </View>
        <Text
            style={{
              height: 0.8,
              borderColor: "#D0D0D0",
              borderWidth: 0.5,
              marginVertical: 5,
            }}
          />
        <FlatList data={reviews} ListEmptyComponent={()=>{
          if(!loadingReviews){
            return(
              <View style={{justifyContent:"center",alignItems:"center",marginVertical:30}}>
                <Text style={{fontSize:22}}>Leave a review</Text>
              </View>
            )
          }
        }} renderItem={({item})=><ReviewCard userName={item.username} stars={item.stars} review={item.review} images={item.images} createdAt={item.createdAt}/>}/>
      </ScrollView>
    </SafeAreaView>
  );
};

function ReviewCard({userName,createdAt,review,stars,images}){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    if(visible){
      // StatusBar.setBackgroundColor("#000");
    }else{
      // StatusBar.setTranslucent(true)
    }
  },[visible])
  const reviewImages=useMemo(()=>{
    return images.map((image,index)=>{
      return {uri:image.url,key:index}
    })
  },[])
  return(
    <View>
      <ImageView  onRequestClose={()=>setVisible(false)} keyExtractor={(item)=>item.key} images={reviewImages} visible={visible} presentationStyle="overFullScreen" backgroundColor="#000"  />
          <View style={{backgroundColor:"#D0D0D0",margin:5,paddingHorizontal:10,paddingVertical:8,flexDirection:"row",height:'auto',borderRadius:5,gap:5}}>
            <View style={{flex:0.15}}>
              <UserAvatar style={{width:50,height:50,borderRadius:25}} size={50} name={userName}/>
            </View>
            <View style={{flex:0.85}}>
              <View>
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",bottom:5}}>
                <Text style={{fontSize:16}}>{userName}</Text>
                {/* <Text style={{fontSize:14}}>{moment(createdAt).format("MMM Do YYYY")}</Text> */}
                <AirbnbRating
                            selectedColor="#008397"
                            reviewColor="#008397"
                            isDisabled
                            showRating={false}
                            count={5}
                            defaultRating={stars}
                            size={14}
                          />
                </View>
                <Text style={{fontSize:16,bottom:5}}>{review}</Text>
                <FlatList data={images} horizontal renderItem={({item})=><TouchableWithoutFeedback onPress={()=>setVisible(true)}>
                <Image  source={{uri:item.url}} style={{height:150,width:200,resizeMode:'contain',marginRight:10}}/>
                  </TouchableWithoutFeedback>}/>
              </View>
            </View>
          </View>
        </View>
  )
}

function ReviewModal({vis,setVis,userId,setReviews,userName,id}){
  const[text,setText]=useState("");
  const[stars,setStars]=useState(0);
  const[focus,setFocus]=useState(false);
  const [uploaded,setUploaded]=useState([]);
  const [loading,setLoading]=useState(false);
  const [index,setIndex]=useState(0);
  const ref=useRef();
  function closeHandler(){
    setText("");
    setStars(0)
    setFocus(false)
    setUploaded([]);
    setVis(false)
    setTimeout(()=>{
      ref.current.close()
    },0)
  }
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const useKeyboard = () => {
  
      
      return keyboardHeight;
    };
    useEffect(() => {
      function onKeyboardDidShow(e) { // Remove type here if not using TypeScript
        setKeyboardHeight(e.endCoordinates.height);
      }
  
      function onKeyboardDidHide() {
        setKeyboardHeight(0);
      }
  
      const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
      const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);
  const pickImage = async () => {
    console.log("called")
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      base64:true
    });
    if(!result.canceled){
      await uploadImage(result.assets[0].base64)
    }
  };
  async function uploadImage(imageData){
    setLoading(true);
    const formData = new FormData();
    formData.append('file',"data:image/png;base64,"+imageData);
    formData.append('upload_preset',"eefnk5l1");
    fetch("https://api.cloudinary.com/v1_1/dacilkmqj/image/upload", {
      method: "POST",
      body: formData
    })
      .then((response) => {
        setLoading(false)
        return response.json();
      })
      .then((data) => {
        setUploaded((arr)=>[...arr,{
          url:data.url,
          height:data.height,
          width:data.width,
          imageId:nanoid()
        }])
      }).catch(()=>{console.log("bruh error")})
  }
  async function submitHandler(){
    setLoading(true);
    try{
      await axios.post(`${link}/reviews/write`,{
        userId,
        userName,
        productId:id,
        stars,
        review:text,
        images:uploaded
      })
      setReviews((revs)=>[...revs,{
        userId,
        username:userName,
        productId:id,
        stars,
        review:text,
        images:uploaded
      }])
      setLoading(false);
      ref.current.close()
      // setIndex(-1);
      closeHandler();
    }catch(e){
      console.log(e,"here");
    }
  }
  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} 
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      onPress={ref.current.close()}
    />,
    []
  );
  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <Pressable onPress={submitHandler} style={{paddingVertical:8,paddingHorizontal:10,borderRadius:5,backgroundColor:'#ffc72c',flexDirection:"row",gap:10,marginHorizontal:20,justifyContent:"center",alignItems:"center"}}>
                <Text style={{fontSize:16}}>{loading?"Uploading...":"Submit"}</Text>
        </Pressable>
      </BottomSheetFooter>
    ),
    [text,stars,focus,uploaded,ref,loading]
  );
  return(
    <>
    <Pressable onPress={()=>ref.current.present()} style={{flexDirection:'row',alignItems:"center"}}>
          <Text style={{marginLeft:10,fontSize:18}}>Write a review</Text>
          <Ionicons name="bookmark" size={16} color={'grey'} style={{top:1}} />
    </Pressable>
    <BottomSheetModal footerComponent={keyboardHeight?()=>{}:renderFooter} backdropComponent={renderBackdrop} enableHandlePanningGesture={false} enableContentPanningGesture={false} enableOverDrag={false} enablePanDownToClose={false}  ref={ref} index={0}
          snapPoints={['60%','80%']}>
            <BottomSheetScrollView nestedScrollEnabled={true}>
             <TextInput multiline placeholder="Write here...." value={text} onChangeText={setText} onFocus={()=>setFocus(true)} onBlur={()=>{
                setFocus(false)
                Keyboard.dismiss()
              }} style={{borderColor:focus?"#008397":"#D0D0D0",borderWidth:1,borderRadius:5,fontSize:16,padding:5,marginHorizontal:20,marginVertical:10,maxHeight:80}}/>
              <FlatList data={uploaded} horizontal renderItem={({item})=>{
                return(
                  <ImageBackground resizeMode='contain' source={{uri:item.url}} style={{height:150,width:200,marginHorizontal:10,backgroundColor:"black"}}>
                    <AntDesign name="close" size={16} color={"#D0D0D0"} onPress={()=>{
                      setUploaded((images)=>images.filter(image=>item.imageId!=image.imageId))
                    }} style={{marginLeft:5}} />
                  </ImageBackground>
                )
              }}/>
              <View style={{alignSelf:'center',justifyContent:"center",alignItems:"center"}}>
              <TouchableOpacity onPress={pickImage} style={{justifyContent:"center",alignItems:"center",flexDirection:"row",marginTop:10,gap:10}}>
                <AntDesign name='camera' color={"#D0D0D0"} size={22} />
                <Text style={{fontSize:16}}>Upload images</Text>
              </TouchableOpacity>
              </View>
              <AirbnbRating
              starContainerStyle={{marginTop:20}}
                            selectedColor="#008397"
                            reviewColor="#008397"
                            onFinishRating={(val)=>setStars(val)}
                            count={5}
                            defaultRating={0}
                            size={20}
                            />
            </BottomSheetScrollView>
            
    </BottomSheetModal>
    </>
  )
}
export default SingleProductScreen;

const styles = StyleSheet.create({});
function CarouselComponent({offer,inWish,removeFromWish,addToWishlist,carouselImages,width,image})
{
  const route=useRoute();
  const images=useMemo(()=>{
    if(!carouselImages){
      return [{uri:image}]
    }
    let images=carouselImages?.map((image,index)=>{
      return {uri:image,key:index}
    });
    return images
  },[])
  const [activeIndex,setActiveIndex]=useState(0);
  const[imageViewVisible,setImageViewVisible]=useState(false);
  return(
    <>
      <ImageView images={images} keyExtractor={(item)=>item.key} presentationStyle="overFullScreen" imageIndex={activeIndex} visible={imageViewVisible} onRequestClose={setImageViewVisible}/>
    <View>
      {offer?<View
              style={{
                backgroundColor: "#C60C30",
                position: "absolute",
                borderRadius: 40,
                width: 40,
                height: 40,
                left: 10,
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                top:30,
                zIndex:10
              }}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 13 }}
              >
                {offer}
              </Text>
            </View>:<></>}
            <View
              style={{
                position: "absolute",
                bottom: 30,
                left: 10,
                padding: 8,
                backgroundColor: "#B7B7B7",
                borderRadius: 20,
                zIndex:10
              }}
              >
              <AntDesign onPress={()=>{
                if(inWish){
                  removeFromWish(route.params.productDetails.id)
                }else{
                  addToWishlist(route.params.productDetails)
                }
              }} name={inWish?"heart":"hearto"} size={22} color="black" />
            </View>
            <View style={{position:"absolute",bottom:25,alignSelf:"center",flexDirection:"row",gap:5}}>
              {carouselImages?.map((image,index)=>{
                return(
                  <Octicons name={activeIndex==index?"dot-fill":"dot"} size={16} color="black" />
                  )
                })}
            </View>
          <Carousel
                width={width}
                height={width}
                data={carouselImages?carouselImages:[image]}
                scrollAnimationDuration={1000}
                enabled={carouselImages?true:false}
                onSnapToItem={(index)=>setActiveIndex(index)}
                renderItem={({ index,item }) => (
                  <View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
                  <TouchableWithoutFeedback onPress={()=>setImageViewVisible(true)}>
                  <ImageBackground
                  source={{ uri: item }}
                  resizeMode='contain'
                  style={{
                    height: 300,
                    width: "100%",
                    alignSelf: "center"
                  }}>

                  </ImageBackground>
                  </TouchableWithoutFeedback>
                    </View>
                )}
                />
            </View>
                </>
  )
}