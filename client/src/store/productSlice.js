import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    products : []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers:{
        setAllProducts:(state,action)=>{
            const products = action.payload
            state.products = products
        }, 
    }
})

export const {setAllProducts} = productSlice.actions

export default productSlice.reducer