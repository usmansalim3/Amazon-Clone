import { createSlice } from "@reduxjs/toolkit";

function sortProductsby(state,payload){
    if(payload==1){
        state.products=state.products.sort((p1,p2)=>p1.price-p2.price)
    }else{
        state.products=state.products.sort((p1,p2)=>p2.price-p1.price)
    }
}

export const ProductsSlice = createSlice({
  name: "products",
  initialState: {
    query: "",
    products:[],
    from:"5",
    to:"1000",
    orderBy:1,
    rating:0,
    category:""
  },
  reducers: {
    setProducts:(state,{payload})=>{
        console.log(state)
        let orderedArr=[];
        if(state.orderBy==1){
            orderedArr=payload.sort((p1,p2)=>p1.price-p2.price);
        }else{
            orderedArr=payload.sort((p1,p2)=>p2.price-p1.price);
        }
        state.products=orderedArr;
    },
    setFilters:(state,{payload})=>{
        state.rating=payload.rating;
        state.from=payload.from;
        state.to=payload.to;
        state.orderBy=payload.orderBy;
    },
    resetFilters:(state)=>{
        state.from=5;
        state.to=1000;
        state.rating=0;
        state.orderBy=1;
        // state.category=""
    },
    setCategory:(state,{payload})=>{
        state.category=payload
    }
  },
});


export const {setProducts,setFilters,setCategory,resetFilters}= ProductsSlice.actions;

export default ProductsSlice.reducer