import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

import { updateUser } from "../../api/internal/userApi";
import { updateUserState } from "../../store/userSlice";
import { updateTotal, resetCart  } from "../../store/cartSlice";
import { saveOrder } from "../../api/internal/orderApi";
import { setCurrentOrderId  } from "../../store/orderSlice";


export default function CheckOut() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const products = useSelector((state) => state.cart.cart);
  const subTotal = useSelector((state) => state.cart.subTotal);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const shippingFee = useSelector((state) => state.cart.shippingFee);
  const totalItem = useSelector((state) => state.cart.totalItem);

  const user = useSelector((state) => state.user.user);
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectPaymentMethod] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  function toggleNewAddress() {
    setIsOpen((prev) => !prev);
  }
  async function onSubmit(data) {
    
    let newUser = {
      userId: user.id,
      shippingAddress: data ,
      action:'push'
    };
    let res = await updateUser(newUser);
    if(res.status === 200){
      dispatch(updateUserState(res.data.updatedUser))
    }
    else{
      // todo set error later
      return
    }
    reset()
  }


  function handlePaymentMethodChange(e) {
    setSelectPaymentMethod(e.target.value);
  }
  function handleAddressChange(e) {
    // handle according to server id later
    let index = e.target.value
    setSelectedAddress(user.shippingAddresses[index]);
  }

  async function proceedOrder() {
    if (totalItem > 0 && selectedAddress && selectedPaymentMethod) {
      let order = {
        userId: user.id,
        products,
        status: "Placed",
        payment: selectedPaymentMethod,
        shippingAddress: selectedAddress,
        subTotal,
        shippingFee,
        totalAmount,
      };
      // todo handle stock
      let res = await saveOrder(order);
      console.log(res)
      if(res.status === 201){
        dispatch(setCurrentOrderId(res.data.order._id))
        dispatch(resetCart())
        navigate('/order/success')
      }
      else if(['ERR_BAD_REQUEST'].includes(res.code)){
        //later
      }
    } else {
      console.log('select address or shipping fee or no item in cart')
      //set error later
    }
  }

  useEffect(() => {
    dispatch(updateTotal());
  });
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        {/* information section */}
        <div className="lg:col-span-3 mt-10 p-3 border-r shadow-inner">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-3xl font-semibold leading-7 text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Use a permanent address where you can receive mail.
              </p>
              <button
                onClick={toggleNewAddress}
                className="flex items-center justify-between rounded-md mt-10 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="font-medium">Add New Address</span>
                <span className="ml-6 flex items-center">
                  {isOpen ? (
                    <MinusIcon className="h-5 w-5" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                </span>
              </button>
              {isOpen && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <div className="mt-2">
                        <input
                          {...register("name", {
                            required: "name is required",
                          })}
                          type="text"
                          id="name"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone No.
                      </label>
                      <div className="mt-2">
                        <input
                          {...register("phone", {
                            required: "last name is required",
                          })}
                          type="tel"
                          id="phone"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          {...register("email", {
                            required: "Enter email address",
                            pattern: {
                              value:
                                /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm,
                              message: "Enter valid email!",
                            },
                          })}
                          type="email"
                          autoComplete="email"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country
                      </label>
                      <div className="mt-2">
                        <select
                          {...register("country")}
                          id="country"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          {...register("street", {
                            required: "street is required",
                          })}
                          id="street"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          {...register("city", {
                            required: "city is required",
                          })}
                          id="city"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          {...register("region", {
                            required: "region is required",
                          })}
                          id="region"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="postalcode"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          type="tel"
                          {...register("postalcode", {
                            required: "postalcode is required",
                          })}
                          id="postalcode"
                          className="block px-1.5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                    onClick={()=>reset()}
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  </div>
                </form>
              )}
            </div>
            {/* mapping addresses */}
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Address
              </h2>

              {user.shippingAddresses ? (
                <>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Choose one from existing
                  </p>
                  <ul role="list" className="divide-y divide-gray-100">
                    {user.shippingAddresses.map((add, index) => (
                      <li
                        key={index}
                        className="flex justify-between gap-x-6 py-5"
                      >
                        <div className="flex gap-x-4">
                          <input
                            id={index}
                            value={index}
                            onClick={handleAddressChange}
                            name="address"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label htmlFor={index}>
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                {add.name}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                {add.phone}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                {add.street} {add.city} {add.province}
                                {add.country}
                                {add.postalcode}
                              </p>
                            </div>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-5">No saved addresses</p>
              )}
              {/* order options */}
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Payment Methods
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Choose Payment Mehtod
                  </p>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-x-3">
                      <input
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        onChange={handlePaymentMethodChange}
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="cash"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cash
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="card"
                        name="paymentMethod"
                        type="radio"
                        value="card"
                        onChange={handlePaymentMethodChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="card"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Card Payment
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
        {/* cart section */}
        <div className="lg:col-span-2 mt-10 bg-gray-100">
          <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-4">
            <div className=" border-gray-200 px-2 py-1 sm:px-4">
              <h1 className="text-4xl font-bold tracking-tight m-2 text-gray-900">
                Cart
              </h1>
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <li key={index} className="flex py-6">
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
                              <NavLink to={`/product/${product._id}`}>
                                {product.title}
                              </NavLink>
                            </h3>
                            <p className="ml-4">
                              ${product.price * product.qty}
                            </p>
                          </div>
                          <p className={`mt-1 text-sm text-gray-900`}>
                            {product.color} -- {product.size}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center col-span-3">
                            <p className="mr-5">Qty:</p>
                            <p className="p-2 w-10 text-center cursor-pointer text-gray-900">
                              {product.qty}
                            </p>
                          </div>

                          {/* <div className="flex">
                          <button
                          onClick={()=>removeProduct(product.itemId)}
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div> */}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-700">
                <p>Subtotal</p>
                <p>${subTotal}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-500">
                <p>Shipping Fee</p>
                <p>${shippingFee}</p>
              </div>
              <div className="flex justify-between  border-t-2  mt-2 text-base font-medium text-black">
                <p>Total Amount</p>
                <p>${totalAmount}</p>
              </div>
              <div className="mt-6">
                <div
                  onClick={proceedOrder}
                  className="cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Pay Now
                </div>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or
                  <NavLink
                  to='/'
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
        </div>
      </div>
    </div>
  );
}
