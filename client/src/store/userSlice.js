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
            state.auth = false
            state.user = null
        },
        updateUserState:(state,action)=>{
            console.log(action.payload)
            state.user = action.payload
        }
    }
})

export const {loginUser,logoutUser,updateUserState} = userSlice.actions;
export default userSlice.reducer