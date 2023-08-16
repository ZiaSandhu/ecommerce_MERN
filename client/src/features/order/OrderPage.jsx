import React from 'react'
import {NavLink} from 'react-router-dom'
import { useSelector } from 'react-redux/es/hooks/useSelector'
const OrderPage = () => {
  const orderId = useSelector(state => state.order.currentOrderId)
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center bg-gray-50 p-10">
          <h2 className="mt-4 text-base font-bold  tracking-tight text-gray-900 sm:text-4xl">Order Placed Successfully</h2>
          <p className="mt-6 text-base leading-7 text-gray-600">Your order Id is {orderId}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <NavLink
            to={`/user/order/:${orderId}`}
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              See Order Detail
            </NavLink>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">

            <NavLink to='/products' className="text-base font-bold text-gray-900 hover:text-indigo-700">
              Continue Shopping <span aria-hidden="true">&rarr;</span>
            </NavLink>
            </div>
        </div>
      </main>
  )
}

export default OrderPage