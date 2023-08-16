import {  useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { getUserOrder, getAllOrder, getOrderDetail } from '../../api/internal/orderApi'
import { setOrders,setOrderDetail } from '../../store/orderSlice'
import { useNavigate} from 'react-router-dom'

export default function OrderList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const filters=[
    'All',
    'Processed',
    'Shipped',
    'Delivered'
  ]
  const auth = useSelector(state => state.user.auth)
  const id = useSelector(state => state.user.user.id)
  const role = useSelector(state => state.user.user.role)
  const orders = useSelector(state => state.order.orders)

  const handleOrderClick = (orderId) => {
    // set order detail
    dispatch(setOrderDetail(orderId));
    //navigate to summary
    navigate(`/user/orderSummary`);
  }
  const handleFilter = () => {
    console.log('handle filter later')
  }
  useEffect(()=>{
    async function gettingOrder(){
      let res;
      if (auth === true) {
        console.log(id)
        if (role === "Customer") {
          res = await getUserOrder(id);
        } else if (role === "admin") {
          res = await getAllOrder();
        }
        console.log(res)
        if (res.status === 200) {
          dispatch(setOrders(res.data.orders));
        }
        else{
          return 
        }
      }
    }
    gettingOrder()
  },[])

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
                  {filters.map((menu, index) => (
                  <div key={index} className="flex items-center gap-x-3">
                  <input
                    id={menu}
                    name="filter"
                    type="radio"
                    onChange={e=> handleFilter(e)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor={menu} className="block text-sm font-medium leading-6 text-gray-900">
                    {menu}
                  </label>
                </div>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="lg:col-span-4">
                <Orders orders={orders}  handleOrderClick={handleOrderClick}/>
              </div>
            </div>
          </section>
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