import {NavLink, useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { useForm } from "react-hook-form"

import {loginUserApi} from '../../api/internal/userApi'
import {loginUser} from '../../store/userSlice'
import { useState } from 'react'
import logo from '../../logo.png'
export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [error,setError] = useState('')
  async function onSubmit(data){
    let user = {
      email: data.email,
      password: data.password,
    }
    let res = await loginUserApi(user)
    if(res.status === 200){
      dispatch(loginUser(res.data.user))
      const originalRoute = localStorage.getItem('originalRoute');    

      // Todo: if record exist in database get record 
      // if cart in local Storage update database record as well as update local storage 2

      if (originalRoute) {
        localStorage.removeItem('originalRoute'); // Remove the stored route
        navigate(originalRoute)
      }else {
        navigate('/')
      }
    }
    else if (res.code === 'ERR_BAD_REQUEST') {
      // console.log(res.status, res.message); // when create api
      setError(res.response.data.message)
    }
  }
  return (
    <>
      
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={logo}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className='text-center text-red-600'>{error}</p>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
              <input
                    id="email"
                    {...register('email', {required: 'Enter email address', pattern:{
                      value:/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm,
                      message:'Enter valid email!'
                    }})}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && <p className='text-red-900 font-light'>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
              <input
                    id="password"
                    {...register('password', {required:'Password is missing' , pattern:{
                      value:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message:`- at least 8 characters \n- must contain at least \n  - uppercase letter \n  - lowercase letter \n  - number \n- Can contain special characters`
                    }})}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.password && <pre className='text-red-900 font-light'>{errors.password.message}</pre>}

              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <NavLink to='/signup' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an Account
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}