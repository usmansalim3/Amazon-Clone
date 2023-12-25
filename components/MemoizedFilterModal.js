import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  FlatList,
  LogBox,
  Platform
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  BottomModal,
  ModalContent,
  ModalTitle,
  SlideAnimation,
} from "react-native-modals";
import { AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilters,
  setFilters,
  setProducts,
} from "../redux/ProductsReducer";
import { Keyboard, KeyboardEvent } from 'react-native';
import { BottomSheetModal, BottomSheetTextInput,BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { ref } from "yup";

const MemoizedFilterModal = () => {
  const dispatch = useDispatch();
  const { from, to, orderBy, rating, category } = useSelector(
    (state) => state.products
  );
  
  const [stars, setStars] = useState(rating);
  const [lowest, setLowest] = useState(from);
  const [highest, setHighest] = useState(to);
  const [sortBy, setSortBy] = useState(orderBy);
  const [modal, setModal] = useState(false);
  
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

    const renderBackdrop = useCallback(
      (props) => <BottomSheetBackdrop {...props} 
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={ref.current.close()}
      />,
      []
    );
  function onCloseHandler() {
    setModal(false);
    setStars(rating);
    setLowest(from);
    setSortBy(orderBy);
    setHighest(to);
  }
  const ref=useRef();
  console.log(keyboardHeight)
  return (
    <>
    <Pressable onPress={()=>{
                // dispatch(setCategory(category))
                // getProducts()
                console.log("click")
                setModal(true)
                ref.current.present()
              }} style={{paddingHorizontal:5,paddingVertical:7,borderRadius:3,marginHorizontal:5,backgroundColor:"#AFEEEE",flexDirection:'row',alignContent:'center',justifyContent:"center"}}>
                        <Text style={{textAlign:'center'}}>Filters</Text>
                          <AntDesign name="down" size={14} color="grey" style={{top:3,marginLeft:3}} />
              </Pressable>
      {/* <Pressable
        onPress={() => setModal(true)}
        style={{
          backgroundColor: "white",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#B7B7B7",
          borderWidth: 0.5,
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 14, color: "grey" }}>Filters</Text>
        <AntDesign
          name="down"
          size={16}
          color="grey"
          style={{ top: 2, marginLeft: 3 }}
        />
      </Pressable> */}
      {/* <BottomModal
        visible={true}
        onHardwareBackPress={onCloseHandler}
        modalTitle={<ModalTitle title="Filters" />}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        onTouchOutside={onCloseHandler}
        //style={{marginBottom:Platform.OS=='ios'?keyboardHeight:0}}
      >
        
        <ModalContent style={{height:300,width:'100%', borderRadius: 20 }}>
          <View style={{ paddingHorizontal: 0 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 22 }}>Reviews</Text>
              <AirbnbRating
                ratingContainerStyle={{ height: 1, top: 2.5 }}
                count={5}
                defaultRating={stars}
                size={22}
                onFinishRating={setStars}
              />
            </View>
            <Text
              style={{
                height: 0.5,
                borderColor: "#D0D0D0",
                borderWidth: 0.5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 22 }}>Price</Text>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "grey",
                    width: 75,
                    paddingHorizontal: 10,
                  }}
                >
                  <TextInput
                    value={lowest}
                    onChangeText={setLowest}
                    style={{ fontSize: 16 }}
                    placeholder="From"
                  />
                </View>
                <AntDesign name="swap" size={22} color="black" />
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "grey",
                    width: 75,
                    paddingHorizontal: 10,
                  }}
                >
                  <TextInput
                    value={highest}
                    onChangeText={setHighest}
                    style={{ fontSize: 16 }}
                    placeholder="To"
                  />
                </View>
              </View>
            </View>
            <Text
              style={{
                height: 0.5,
                borderColor: "#D0D0D0",
                borderWidth: 0.5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 21 }}>Order by :</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => setSortBy(1)}
                  style={{
                    padding: 5,
                    paddingHorizontal: 8,
                    borderColor: "#B7B7B7",
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor: sortBy == 1 ? "#00CED1" : "white",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      color: sortBy == 1 ? "white" : "black",
                    }}
                  >
                    Low to High
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSortBy(2)}
                  style={{
                    padding: 5,
                    paddingHorizontal: 8,
                    borderColor: "#B7B7B7",
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor: sortBy == 2 ? "#00CED1" : "white",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      color: sortBy == 2 ? "white" : "black",
                    }}
                  >
                    High to Low
                  </Text>
                </Pressable>
              </View>
            </View>
            <Text
              style={{
                height: 0.8,
                borderColor: "#D0D0D0",
                borderWidth: 0.5,
                marginTop: 5,
              }}
            />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 24,
                borderRadius: 3,
              }}
            >
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setModal(false);
                  dispatch(
                    setFilters({
                      from: lowest,
                      to: highest,
                      orderBy: sortBy,
                      rating: stars,
                    })
                  );
                }}
                style={{ paddingHorizontal: 10,backgroundColor:'#ffc72c',paddingVertical:5,width:"50%",borderRadius:20 }}
              >
                <Text style={{ textAlign: "center", fontSize: 18 }}>Apply</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setModal(false);
                  dispatch(resetFilters());
                }}
                style={{ backgroundColor:"#ffc72c",paddingHorizontal:10,paddingVertical:5,width:'50%',borderRadius:20 }}
              >
                <Text style={{ textAlign: "center", fontSize: 18 }}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal> */}
      <BottomSheetModal ref={ref} backdropComponent={renderBackdrop}  snapPoints={['35%','35%']} index={1}>
      <View style={{ paddingHorizontal: 10 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 22 }}>Reviews</Text>
              <AirbnbRating
                ratingContainerStyle={{ height: 1, top: 2.5 }}
                count={5}
                defaultRating={stars}
                size={22}
                onFinishRating={setStars}
              />
            </View>
            <Text
              style={{
                height: 0.5,
                borderColor: "#D0D0D0",
                borderWidth: 0.5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 22 }}>Price</Text>
              <View
                style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              >
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "grey",
                    width: 75,
                    paddingHorizontal: 10,
                  }}
                >
                  <BottomSheetTextInput
                    value={lowest}
                    onChangeText={setLowest}
                    style={{ fontSize: 16 }}
                    placeholder="From"
                  />
                </View>
                <AntDesign name="swap" size={22} color="black" />
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "grey",
                    width: 75,
                    paddingHorizontal: 10,
                  }}
                >
                  <BottomSheetTextInput
                    
                    value={highest}
                    onChangeText={setHighest}
                    style={{ fontSize: 16 }}
                    placeholder="To"
                  />
                </View>
              </View>
            </View>
            <Text
              style={{
                height: 0.5,
                borderColor: "#D0D0D0",
                borderWidth: 0.5,
                marginTop: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 21 }}>Order by :</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => setSortBy(1)}
                  style={{
                    padding: 5,
                    paddingHorizontal: 8,
                    borderColor: "#B7B7B7",
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor: sortBy == 1 ? "#00CED1" : "white",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      color: sortBy == 1 ? "white" : "black",
                    }}
                  >
                    Low to High
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSortBy(2)}
                  style={{
                    padding: 5,
                    paddingHorizontal: 8,
                    borderColor: "#B7B7B7",
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor: sortBy == 2 ? "#00CED1" : "white",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      color: sortBy == 2 ? "white" : "black",
                    }}
                  >
                    High to Low
                  </Text>
                </Pressable>
              </View>
            </View>
            <Text
              style={{
                height: 0.8,
                borderColor: "#D0D0D0",
                borderWidth: 0.5,
                marginTop: 5,
              }}
            />
            <View
              style={{
                alignItems: "stretch",
                width:"75%",
                alignSelf:'center',
                justifyContent: "center",
                gap: 10,
                marginTop: 24,
                borderRadius: 3
              }}
            >
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setModal(false);
                  dispatch(
                    setFilters({
                      from: lowest,
                      to: highest,
                      orderBy: sortBy,
                      rating: stars,
                    })
                    );
                    setTimeout(()=>{
                      ref.current.close()
                      ref.current.close()
                    },1000)
                }}
                style={{ paddingHorizontal: 10,backgroundColor:'#ffc72c',paddingVertical:5,borderRadius:20 }}
              >
                <Text style={{ textAlign: "center", fontSize: 18 }}>Apply</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setModal(false);
                  dispatch(resetFilters());
                  setTimeout(()=>{
                    ref.current.close()
                    ref.current.close()
                  },1000)
                  // ref.current.close()
                }}
                style={{ backgroundColor:"#ffc72c",paddingHorizontal:10,paddingVertical:5,borderRadius:20 }}
              >
                <Text style={{ textAlign: "center", fontSize: 18 }}>Reset</Text>
              </Pressable>
            </View>
          </View>
      </BottomSheetModal>
    </>
  );
};

export default memo(MemoizedFilterModal);

const styles = StyleSheet.create({});
