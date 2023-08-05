import React, { useEffect } from 'react'
import { logoutUser } from '../../store/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Signout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
        dispatch(logoutUser)
        navigate('/')
    })
  return (
//   navigate()
<></>
  )
}

export default Signout