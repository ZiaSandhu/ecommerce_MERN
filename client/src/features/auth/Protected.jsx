import React  from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const Protected = ({children}) => {
    const location = useLocation()
    const isAuth = useSelector((state)=>state.user.auth)
    // function protect() {
        if(isAuth){
            return children
        }
        else{
            // todo this login is not valid if component render twice
            // localStorage.setItem('originalRoute', location.pathname);
            return <Navigate to='/login' />
        }

}

export default Protected