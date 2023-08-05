import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    user: {},
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
        }
    }
})

export const {loginUser,logoutUser} = userSlice.actions;
export default userSlice.reducer