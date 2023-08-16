import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    currentOrderId: null,
    orders:null,
    orderDetail: null,
    filterOrder: null
}

const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers:{
        setCurrentOrderId:(state,action)=>{
            state.currentOrderId = action.payload
        },
        resetCurrentId:(state)=> {
            state.currentOrderId = null
        },
        setOrders:(state,action)=>{
            state.orders = action.payload
        },
        setOrderDetail:(state,action)=>{
            let id = action.payload 
            let orders = [...state.orders]
            let detail = orders.filter(item => item._id === id)
            state.orderDetail = detail[0]
        },
        resetOrderDetails:(state,action)=>{
            state.orderDetail = null
        },
        filterOrders:(state,action)=>{
            
        }
    }
})

export const {setCurrentOrderId, resetCurrentId, setOrders, setOrderDetail, resetOrderDetails} = orderSlice.actions
export default orderSlice.reducer