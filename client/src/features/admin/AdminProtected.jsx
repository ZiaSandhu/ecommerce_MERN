import React  from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const AdminProtected = ({children}) => {
    const location = useLocation()
    const isAuth = useSelector((state)=>state.user.auth)
    // function protect() {
    const user = useSelector(state => state.user.user)
        if(user?.role === 'admin'){
            return children
        }
        else{
            localStorage.setItem('originalRoute', location.pathname);
            return <Navigate to='/login' />
        }

}

export default AdminProtected