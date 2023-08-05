import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart:[],
    subTotal:0,
    totalAmount:0,
    shippingFee:500,
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart: (state,action)=>{
            state.cart = [...state.cart, action.payload]
            console.log(state.cart);
        },
        calculateSubTotal:(state,action)=>{
            let subTotalArray = state.cart.map((item)=> item.qty*item.price )
            // state.subTotal
        },
        calculateTotal:(state,action)=>{

        }
    }
})

export const {addToCart} = cartSlice.actions
export default cartSlice.reducer