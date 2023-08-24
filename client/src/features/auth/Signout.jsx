import React, { useEffect } from 'react'
import { logoutUser } from '../../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import {logoutUserApi} from '../../api/internal/userApi'


const Signout = () => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.user.auth)
    async function logout() {
      await logoutUserApi()
      dispatch(logoutUser())
    }
    useEffect(()=>{
      logout()
    },[])
    return(
      <>
      { !auth && <Navigate to='/' /> }
      </>
    )
  
}

export default Signout