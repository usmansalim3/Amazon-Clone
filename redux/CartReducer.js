import { createSlice } from "@reduxjs/toolkit";

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, {payload}) => {
      state.cart=state.cart.filter(item=>item.id!==payload)
      console.log(state.cart)
    },
    incementQuantity: (state, {payload}) => {
      const itemPresent = state.cart.find(
        (item) => item.id === payload
      );
      itemPresent.quantity++;
    },
    decrementQuantity: (state, {payload}) => {
      const itemPresent = state.cart.find(
        (item) => item.id === payload
      );
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
        const removeItem = state.cart.filter(
          (item) => item.id !== payload
        );
        state.cart = removeItem;
      } else {
        itemPresent.quantity--;
      }
    },
    cleanCart:(state) => {
        state.cart = [];
    },
    setCart:(state,{payload})=>{
      state.cart=payload
    }
  },
});


export const {addToCart,removeFromCart,incementQuantity,decrementQuantity,cleanCart,setCart} = CartSlice.actions;

export default CartSlice.reducer