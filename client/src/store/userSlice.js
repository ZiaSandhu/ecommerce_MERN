import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: null,
    auth: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        loginUser:(state,action)=>{
            state.user = action.payload
            state.auth = true
            
        },
        logoutUser: (state,action)=>{
            state.user = null
            state.auth = false
        },
        udpateAddresses:(state,action)=>{
            let address = action.payload
            state.user.shippingAddresses.push(address) 
        }
    }
})

export const {loginUser,logoutUser,udpateAddresses} = userSlice.actions;
export default userSlice.reducer