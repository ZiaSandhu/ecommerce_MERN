import React, { useEffect } from 'react'
import { logoutUser } from '../../store/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Signout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
      console.log('signout component')
        dispatch(logoutUser())
        navigate('/')
    },[])
  return (
  <></>
  )
}

export default Signout