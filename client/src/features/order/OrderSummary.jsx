import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const OrderSummary = () => {
  const dispatch = useDispatch()
  const orderDetail = useSelector((state) => state.order.orderDetail);
  const {
    products,
    subTotal,
    shippingAddress,
    totalAmount,
    shippingFee,
    status,
    createdAt,
    payment,
  } = orderDetail;
  const { street, city, region, country, postalcode } = shippingAddress;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold tracking-tight mt-5 text-gray-900">
        Order Summary
      </h1>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
        {/* cart section */}
        <div className="lg:col-span-3 mt-10 bg-white">
          <h1 className="text-4xl font-bold tracking-tight m-2 text-gray-900">
            Products
          </h1>
          <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-4">
            <div className=" border-gray-200 px-2 py-1 sm:px-4">
              <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {products &&
                    products.map((product, index) => (
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
                              <h3>{product.title}</h3>
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
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className=" lg:col-span-2 mt-10 px-4 py-6 sm:px-6 bg-white">
          <div className="flex justify-between text-base font-medium text-gray-700">
            <p>Status: {status}</p>
            <p>Date: {createdAt}</p>
          </div>
          <hr className="my-5" />
          <div className="flex justify-between text-base font-medium text-gray-700">
            <p>Subtotal</p>
            <p>${subTotal}</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-500">
            <p>Shipping Fee</p>
            <p>${shippingFee}</p>
          </div>
          <div className="flex justify-between  border-t-2  mt-3 text-base font-medium text-black">
            <p>Total Amount</p>
            <p>${totalAmount}</p>
          </div>
          <hr className="my-5" />

          <div className="text-base text-gray-500">
            <p className="text-black mb-3">Shipping Address:</p>
            <p>
              {street} {city}{" "}
            </p>
            <p>
              {" "}
              {region} {country} {postalcode}{" "}
            </p>
          </div>
          <hr className="my-5" />
          <div className="text-base mt-5">
            <p className="text-black mb-3">
              Payment Method: <span className="text-gray-500">{payment}</span>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
