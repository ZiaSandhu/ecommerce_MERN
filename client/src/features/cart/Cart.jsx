import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react';
import { addCart } from '../../api/internal/cartApi';
import { removeItem, decreaseQty, increaseQty, updateTotal, localStorageCart } from '../../store/cartSlice';

export default function Cart() {

  const products = useSelector(state => state.cart.cart)
  const subTotal = useSelector(state => state.cart.subTotal)
  const dispatch = useDispatch()
  const id = useSelector(state => state.user.user?.id)
  function increseQty(id) {
    products.forEach(item => {
      if(item.itemId === id && item.qty+1 <= item.stock){
        dispatch(increaseQty(id))
      }
    });
  }
  function decreseQty(id) {
    products.forEach(item => {
      if(item.itemId === id && item.qty > 1){
        dispatch(decreaseQty(id));
      }
    });
  }
  function removeProduct(id) {
    dispatch(removeItem(id))
  }
  useEffect(()=>{
    async function updateCart(){
      let data={
        user: id,
        products
      }
      // await addCart(data)
    }
    updateCart();
    dispatch(updateTotal())
    dispatch(localStorageCart())
  },[products])
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight m-2 text-gray-900">
          Cart
        </h1>
        {products.length > 0 ?(<div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.itemId} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <NavLink to={`/product/${product.id}`}>
                          {product.title}
                        </NavLink>
                      </h3>
                      <p className="ml-4">${product.price * product.qty}</p>
                    </div>
                    <p className={`mt-1 text-sm text-gray-900`}>
                      {product.color} -- {product.size}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                      
                        <div className="flex items-center col-span-3">
                          <p className='mr-5'>Qty:</p>
                          <button
                            className="p-2 cursor-pointer bg-gray-300 text-gray-900 hover:bg-gray-100"
                             onClick={()=>decreseQty(product.itemId)}
                          >
                            <MinusIcon className="h-2 w-2" />
                          </button>
                          <p className="p-2 w-10 text-center cursor-pointer text-gray-900">
                            {product.qty}
                          </p>
                          <button
                            className="p-2 cursor-pointer bg-gray-300 text-gray-900 hover:bg-gray-100"
                             onClick={()=>increseQty(product.itemId)}
                          >
                            <PlusIcon className="h-2 w-2" />
                          </button>
                        </div>

                    <div className="flex">
                      <button
                      onClick={()=>removeProduct(product.itemId)}
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>) :
        (
          <p className='text-center text-gray-900'>No items in Cart</p>
        )
        }
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${subTotal}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6">
          <NavLink
            to="/checkout"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Checkout
          </NavLink>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or
            <NavLink
              to="/products"
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}