import {configureStore, createReducer} from '@reduxjs/toolkit'
import productReducer from './productSlice'
import cartReducer from './cartSlice'
import userReducer from './userSlice'
import orderReducer from './orderSlice'
export const store = configureStore({
    reducer: {
        product: productReducer,
        cart: cartReducer,
        user: userReducer,
        order: orderReducer
    }
})