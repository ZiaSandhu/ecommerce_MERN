import React, { useEffect } from 'react'
import { logoutUser } from '../../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
const Signout = () => {
    const dispatch = useDispatch()
    const auth = useSelector(state => state.user.auth)
    useEffect(()=>{
      dispatch(logoutUser())
    },[])
    return(
      <>
      { !auth && <Navigate to='/' /> }
      </>
    )
  
}

export default Signout