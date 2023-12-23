import { createSlice } from "@reduxjs/toolkit"

const initialState={
    userId:null,
    userName:null,
    email:null,
    addresses:[],
    orders:[],
    defaultAddress:undefined,
    wishlist:[]
}
const userReducer=createSlice({
    initialState,
    name:"userReducer",
    reducers:{
        loggedIn:(state,{payload})=>{
            console.log("loggin")
            console.log(payload)
            state.userId=payload.userId;
            state.userName=payload.userName
            state.email=payload.email
            state.addresses=payload.addresses;
            state.orders=payload.orders
            state.defaultAddress=payload.defaultAddress,
            state.wishlist=payload.wishlist
        },
        updateAddress:(state,{payload})=>{
            // console.log(payload)
            console.log("doin")
            state.addresses.push(payload);
        },
        editAddress:(state,{payload})=>{
            state.addresses.forEach((address,idx)=>{
                if(address.addressID==payload.addressID){
                    if(state.defaultAddress.addressID==address.addressID){
                        state.defaultAddress=payload.address
                    }
                    state.addresses[idx]=payload.address;
                }
            })
        },
        removeAddress:(state,{payload})=>{
            console.log(state.addresses);
            console.log(payload)
            if(state.defaultAddress.addressID==payload.addressID){
                state.defaultAddress=undefined;
            }
            state.addresses=state.addresses.filter(add=>add.addressID!==payload);
        },
        setDefaultAddress:(state,{payload})=>{
            state.defaultAddress=payload
        },
        addAddress:(state,{payload})=>{
            state.addresses.push(payload);
        },
        addWish:(state,{payload})=>{
            state.wishlist.push(payload);
        },
        removeFromWish:(state,{payload})=>{
            state.wishlist=state.wishlist.filter((wish)=>wish.id!==payload)
        },
        logout:(state)=>{
            state.addresses=[];
            state.defaultAddress=undefined;
            state.wishlist=[];
            state.userId=null;
            state.email=null;
            state.orders=[];
            state.userName=null;
        },
        addOrders:(state,{payload})=>{
            state.orders.push(payload);
        }
    },

})
export default userReducer.reducer;
export const {loggedIn,updateAddress,removeAddress,setDefaultAddress,addAddress,addWish,removeFromWish,logout,addOrders,editAddress}=userReducer.actions
