
import { useNavigation } from "@react-navigation/native";
import { memo, useCallback, useRef, useState } from "react";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons,Entypo,AntDesign } from "@expo/vector-icons";
import {
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
  } from "react-native";
import axios from "axios";
import { setDefaultAddress } from "../redux/UserReducer";
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { link } from "../data/data";
  
// Define your BottomModal component

function MemoizedModal() {
  const navigation=useNavigation();
  const addresses=useSelector(state=>state.user.addresses)
  const dispatch=useDispatch();
  const userName=useSelector(state=>state.user.userName);
  const defaultAddress=useSelector(state=>state.user.defaultAddress);
  const userId=useSelector(state=>state.user.userId)
  const [modal,setModal]=useState(false);
  const ref=useRef();
  async function setDefaultAddressHandler(address){
    try{
      const res=await axios.post(`${link}/addresses/setDefault`,{
        userId,
        address
      });
      console.log(res.data);
      dispatch(setDefaultAddress(address))
    }catch(e){
      console.log(e);
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

  function addressToDisplay(){
    if(defaultAddress!==undefined){
        let displayAddress=defaultAddress.city.trim()+" - "+defaultAddress.postalCode.trim();
        return displayAddress
    }
    else if(addresses.length==0){
        return "Delhi - 110080"
    }else{
        let displayAddress=addresses[0].city.trim()+" - "+addresses[0].postalCode.trim();
        return displayAddress
    }
  }
  return (
    <>
    <Pressable onPress={()=>ref.current.present()} style={{
              backgroundColor: "#AFEEEE",
              width: "100%",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
              <Entypo name="location-pin" size={24} color="red" />
              <Text style={{fontSize:15}}>Deliver to {userName.charAt(0).toUpperCase()+userName.slice(1)} {addressToDisplay()}</Text>
              </View>
              <AntDesign name="down" size={18} style={{top:1,marginLeft:20}} color="grey" />
          </Pressable>
          <BottomSheetModal enableHandlePanningGesture={false} enableContentPanningGesture={false} enablePanDownToClose={false}   backdropComponent={renderBackdrop}  ref={ref} index={1}
          snapPoints={['35%','35%']}>
            <View style={{flex:1}}>
            <Text style={{ fontSize: 18,marginLeft:5 }}>Choose your location</Text>
        <Text style={{ fontSize: 14, color: '#B7B7B7',marginLeft:5 }}>
          Select a delivery location to see if products are available at your location
        </Text>
        <View style={{flex:1,marginTop:5}}>
        <BottomSheetFlatList  ListFooterComponent={()=>{return(
          <Pressable
          onPress={() => {
            setModal(false);
            ref.current.close()
            navigation.navigate('yourAddresses');
          }}
          style={{
            height: 140,
            width: 140,
            justifyContent: "center",
            alignItems: 'center',
            borderWidth: 1,
            borderColor: "#B7B7B7",
            marginRight:5
          }}
        >
          <Text style={{ textAlign: 'center', color: "#0066B2" }}>Add an address or pick-up location</Text>
        </Pressable>
        )}} horizontal showsHorizontalScrollIndicator={false} data={addresses} renderItem={({item,index})=>{
          let address=item;
          return(
          <Pressable
          key={address.id} 
          onPress={() => {
            ref.current.close();
            setDefaultAddressHandler(address)
          }}
          style={{
            height: 140,
            width: 130,
            justifyContent: "center",
            alignItems: 'center',
            borderWidth: 1,
            borderColor: "#B7B7B7",
            marginRight: 12,
            marginLeft:index==0?5:0
          }}
        >
          <View style={{flexDirection:"row",alignItems:'center'}}>
            <Text style={{ textAlign: 'center', color: "#0066B2", fontWeight: '600', fontSize: 16 }}>{address.name}</Text>
            <Entypo name="location-pin" size={24} color="red" />
          </View>
          <Text style={{ textAlign: 'center' }}>{address.houseNo}</Text>
          <Text style={{ textAlign: 'center' }}>{address.street}</Text>
          <Text style={{ textAlign: 'center' }}>{address.city}</Text>
          <Text style={{ textAlign: 'center' }}>{address.postalCode}</Text>
        </Pressable>
          )
        }}/>
        </View>
          </View>
          </BottomSheetModal>
    {/* <BottomModal
      visible={modal}
      onHardwareBackPress={() => setModal(false)}
      modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      onTouchOutside={() => setModal(false)}
    >
      <ScrollView>

      <ModalContent style={{ height:'auto', width: '100%', borderRadius: 20,zIndex:100 }}>
        <Text style={{ fontSize: 18 }}>Choose your location</Text>
        <Text style={{ fontSize: 14, color: '#B7B7B7' }}>
          Select a delivery location to see if products are available at your location
        </Text>
        
        <FlatList horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{backgroundColor:"black",zIndex:100}} data={addresses} renderItem={({item})=>{
          let address=item;
          return(
          <Pressable
          key={address.id} 
          onPress={() => {
            setModal(false);
            setDefaultAddressHandler(address)
          }}
          style={{
            height: 140,
            width: 130,
            justifyContent: "center",
            alignItems: 'center',
            borderWidth: 1,
            borderColor: "#B7B7B7",
            marginRight: 12,
          }}
        >
          <View style={{flexDirection:"row",alignItems:'center'}}>
            <Text style={{ textAlign: 'center', color: "#0066B2", fontWeight: '600', fontSize: 16 }}>{address.name}</Text>
            <Entypo name="location-pin" size={24} color="red" />
          </View>
          <Text style={{ textAlign: 'center' }}>{address.houseNo}</Text>
          <Text style={{ textAlign: 'center' }}>{address.street}</Text>
          <Text style={{ textAlign: 'center' }}>{address.city}</Text>
          <Text style={{ textAlign: 'center' }}>{address.postalCode}</Text>
        </Pressable>
          )
        }}/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>

          <Pressable
            onPress={() => {
              setModal(false);
              navigation.navigate('yourAddresses');
            }}
            style={{
              height: 140,
              width: 140,
              justifyContent: "center",
              alignItems: 'center',
              borderWidth: 1,
              borderColor: "#B7B7B7"
            }}
          >
            <Text style={{ textAlign: 'center', color: "#0066B2" }}>Add an address or pick-up location</Text>
          </Pressable>
        </ScrollView>
      </ModalContent>
      </ScrollView>
    </BottomModal> */}
      </>
  );
}

// Memoize the BottomModal component using React.memo
const MemoizedBottomModal = memo(MemoizedModal);

export default MemoizedBottomModal;
