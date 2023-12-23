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
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons,Feather } from "@expo/vector-icons";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { StackActions } from '@react-navigation/native';
import Modal, {
    ModalButton,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from "react-native-modals";
import { link } from "../../data/data";
import Spinner from "react-native-loading-spinner-overlay";

const RegisterScreen = () => {
  const navigation=useNavigation();
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [visible,setVisible]=useState(false);
  const [modal, setModal] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .min(3, "Too short!")
        .max(30, "Name length limited reached!")
        .required("Email is required!")
        .email("Enter a valid email"),
      password: yup
        .string()
        .min(3, "Too short!")
        .max(20, "Name length limited reached!")
        .required("Password is required!"),
      username: yup
        .string()
        .min(3, "Too short")
        .max(20, "Too long")
        .required("Name is required"),
    }),
    onSubmit: (values) => {
      register()
    },
  });
  async function register() {
    try {
      setLoading(true);
      const res = await axios.post(`${link}/register`, {
        name: formik.values.username,
        email: formik.values.email,
        password: formik.values.password,
      });
      setModal(true);
      setLoading(false)
      console.log(res.data)
      //setModal(true);
    } catch (e) {
      setLoading(false)
      setModal(true)
      setError(e.response.data.message);
    }
  }
  return (
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
          style={{ width: 180, height: 100, marginTop: 30 }}
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
        Register your account
      </Text>

      <KeyboardAvoidingView
        style={{ marginTop: 110 }}
        contentContainerStyle={{ marginBottom: 20 }}
        behavior={Platform.OS === "android" ? "position" : "padding"}
      >
        <View
          style={{
            borderRadius: 5,
            backgroundColor:
              formik.errors.username && formik.touched.username
                ? "#E57373"
                : "#D0D0D0",
            flexDirection: "row",
            width: "80%",
            alignSelf: "center",
            padding: 10,
            gap: 5,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="person-circle" size={24} color="grey" />
          <TextInput
            placeholder="Enter your name"
            onChangeText={formik.handleChange("username")}
            onBlur={formik.handleBlur("username")}
            style={{ fontSize: 16,width:"85%" }}
          />
        </View>
        <View
          style={{
            borderRadius: 5,
            backgroundColor:
              formik.errors.email && formik.touched.email
                ? "#E57373"
                : "#D0D0D0",
            flexDirection: "row",
            width: "80%",
            alignSelf: "center",
            padding: 10,
            gap: 5,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="email" size={24} color="grey" />
          <TextInput
            placeholder="Enter Email"
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            style={{ fontSize: 16,width:"85%" }}
          />
        </View>
        <View
          style={{
            borderRadius: 5,
            backgroundColor:
              formik.errors.password && formik.touched.password
                ? "#E57373"
                : "#D0D0D0",
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
            secureTextEntry={visible}
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
        <Pressable
          onPress={formik.handleSubmit}
          style={{
            padding: 10,
            backgroundColor: "#ffc72c",
            borderRadius: 3,
            marginTop: 25,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "400",
              fontSize: 16,
              color: "white",
            }}
          >
            REGISTER
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
      <Modal visible={modal} modalTitle={<ModalTitle title={error?"Something went wrong":"Success"}/>}
      footer={
        <ModalFooter>
            <ModalButton onPress={()=>{
              if(error){
                setModal(false)
              }else{
                setModal(false)
                navigation.dispatch(StackActions.pop())
              }
            }} text="OK"/>
        </ModalFooter>
      }
      >
        <ModalContent style={{alignSelf:'center',alignItems:'center',top:10}}>
          <Text style={{fontSize:16}} numberOfLines={2}>{error?error:"Account created"}</Text>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
