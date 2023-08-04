import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    products : [],
    totalProducts: 0,
    categories: [],
    brands:[],
    productDetail:{}
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers:{
        setAllProducts:(state,action)=>{
            const {products, totalProducts} = action.payload
            state.products = products
            state.totalProducts = totalProducts
        }, 
        setCategory:(state,action)=>{
            state.categories = action.payload
        },
        setBrand:(state,action)=>{
            state.brands = action.payload
        },
        setProduct:(state,action)=>{
            state.productDetail = action.payload
            console.log("🚀 ~ file: productSlice.js:27 ~ state.productDetail:", state.productDetail)
            
        }
    }
})

export const {setAllProducts, setCategory, setBrand,setProduct} = productSlice.actions

export default productSlice.reducer