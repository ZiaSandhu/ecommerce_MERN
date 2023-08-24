import {  useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { getAllOrder } from '../../api/internal/orderApi'
import { setOrders,setOrderDetail } from '../../store/orderSlice'
import { useNavigate} from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function AdminOrderList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const filterOptions=[
    'All',
    "Placed",
    'Processed',
    'Shipped',
    'Delivered'
  ]
  const auth = useSelector(state => state.user.auth)
  const orders = useSelector(state => state.order.orders)
  const [filter,setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const handleOrderClick = (orderId) => {
    dispatch(setOrderDetail(orderId));
    navigate(`/user/orderSummary`);
  }
  const handlePagination = () => {

  }
  let totalCount
  useEffect(()=>{
    async function gettingOrder(){
      let res;
      if (auth === true) {
          res = await getAllOrder(filter,page);
        if (res.status === 200) {
          dispatch(setOrders(res.data.orders));
          totalCount = res.data.totalCount
        }
        else{
          return 
        }
      }
    }
    gettingOrder()
  },[dispatch,filter,page])

  return (
    <div className="bg-gray-100">
      <div>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className=" py-5 text-4xl font-bold tracking-tight text-gray-900">
            Orders
          </h1>

          <section aria-labelledby="products-heading" className="pb-10 pt-3">
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-5">
              <div className="p-5 h-30 bg-white shadow-xl max-h-auto">
                <h1 className="text-base font-bold tracking-tight text-gray-900">
                  Filter Orders
                </h1>
                <div className="grid grid-cols-2 lg:grid-cols-1 mt-5">
                  {filterOptions.map((menu, index) => (
                    <div key={index} className="flex items-center gap-x-3">
                      <input
                        id={menu}
                        name="filter"
                        type="radio"
                        onChange={() => {
                          setFilter(menu);
                          setPage(1);
                        }}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor={menu}
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        {menu}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="lg:col-span-4">
                <Orders orders={orders} handleOrderClick={handleOrderClick} />
              </div>
            </div>
          </section>

          <Pagination
            handlePagination={handlePagination}
            _page={page}
            totalCount={totalCount}
          />
        </main>
      </div>
    </div>
  );
}

const Orders = ({orders,handleOrderClick}) => {
return (
  <ul role="list" className="divide-y divide-gray-900  shadow-2xl p-3 bg-white">
    {orders ? (
      orders.map((order, index) => (
        <li key={index} className="p-5 ">
          <div className="flex justify-between">
              <h1 onClick={()=>handleOrderClick(order._id)} className= "cursor-pointer text-larger font-bold leading-6 text-indigo-500">
                Order Id:{order._id}
              </h1>
            <p className="text-sm leading-6 text-gray-900">
              Date: {order.createdAt}
            </p>
          </div>
          <hr className="mt-2 mb-2 border-dashed" />
          <div className="flex justify-between ">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 gap-5 flex-auto">
                <p className="text-base leading-6 text-gray-900 mb-2">
                  Total Amount: {order.totalAmount}
                </p>
                <p className="text-large font-semibold leading-6 text-gray-900">
                  Tracking Id: {order.trackingId}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  status: {order.status}
                </p>
              </div>
            </div>
          </div>
        </li>
      ))
    ) : (
      <p>No previous Order</p>
    )}
  </ul>
);
}

function Pagination({handlePagination, _page, totalCount}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <div
          onClick={(e) => handlePagination(_page - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </div>
        <div
          onClick={(e) => handlePagination(_page + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(_page - 1) * 10 + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {_page * 10 > totalCount
                ? totalCount
                : _page * 10}
            </span>{" "}
            of <span className="font-medium"> {totalCount} </span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={(e) => handlePagination(_page - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            {Array.from({
              length: Math.ceil(totalCount / 10),
            }).map((item, index) => (
              <div
                key={index}
                onClick={(e) => handlePagination(index + 1)}
                className={`relative hidden items-center px-4 py-2 text-sm font-semibold ${
                  index + 1 === _page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900"
                } ring-1 ring-inset ring-gray-300 hover:bg-gray-300 hover:text-black  md:inline-flex cursor-pointer`}
              >
                {index + 1}
              </div>
            ))}
            <div
              onClick={(e) => handlePagination(_page + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}