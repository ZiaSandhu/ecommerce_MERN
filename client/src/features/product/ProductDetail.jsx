import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { StarIcon, PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'

import { addToCart } from '../../store/cartSlice';


const reviews = { href: '#', average: 4, totalCount: 117 }
const colors = [
  { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
  { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
  { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
]
const sizes = [
  { name: 'XXS', inStock: false },
  { name: 'XS', inStock: true },
  { name: 'S', inStock: true },
  { name: 'M', inStock: true },
  { name: 'L', inStock: true },
  { name: 'XL', inStock: true },
  { name: '2XL', inStock: true },
  { name: '3XL', inStock: true },
]
const breadcrumbs = [
  { id: 1, name: 'Men', href: '#' },
  { id: 2, name: 'Clothing', href: '#' },
]
const highlights = [
  'Hand cut and sewn locally',
  'Dyed with our proprietary colors',
  'Pre-washed & pre-shrunk',
  'Ultra-soft 100% cotton',
]
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()
// todo: change following code
const [selectedColor, setSelectedColor] = useState(colors[0])
const [selectedSize, setSelectedSize] = useState(sizes[2])
const [quantity, setQuantity] = useState(1)
// Upper code is hardcoded data not from api, chages will be applied
const product = location.state?.product;
const [openImage, setOpenImage] = useState(product.images[0])

const changeImage = (e) => {
  setOpenImage(e.target.src)
}

  const handleAddToCart = () => {
    // e.preventDefault()
    const cartItem = {
      productId:product._id,
      title:product.title,
      price:product.price,
      color: selectedColor.name,
      thumbnail: product.thumbnail,
      size: selectedSize.name,
      qty: quantity,
      subTotal: quantity*product.price,
      itemId: `${product._id}-${selectedColor.name}-${selectedSize.name}`,
    };
    // todo: api call to add cart to database
    dispatch(addToCart(cartItem))
    navigate('/cart')
  }
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <p
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.title}
              </p>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        {product.images && (
          <div className="bg-gray-50 mx-auto mt-6 max-w-2xl">
            <div className='grid justify-center py-2 '>
              <img className='h-56 w-100 ' src={openImage} alt="product" />
            </div>
            <div className="flex gap-4 items-center justify-center">
              {product.images.map((item,index) => (
                <img onClick={(e)=>changeImage(e)} key={index} className='h-20 w-20' src={item} alt="item" />
              ))}
            </div>
          </div>
        )}

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              ${product.price}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </p>
              </div>
            </div>

            {/* <form className="mt-10"> */}
            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Color</h3>

              <RadioGroup
                value={selectedColor}
                onChange={setSelectedColor}
                className="mt-4"
              >
                <RadioGroup.Label className="sr-only">
                  Choose a color
                </RadioGroup.Label>
                <div className="flex items-center space-x-3">
                  {colors.map((color) => (
                    <RadioGroup.Option
                      key={color.name}
                      value={color}
                      className={({ active, checked }) =>
                        classNames(
                          color.selectedClass,
                          active && checked ? "ring ring-offset-1" : "",
                          !active && checked ? "ring-2" : "",
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                        )
                      }
                    >
                      <RadioGroup.Label as="span" className="sr-only">
                        {color.name}
                      </RadioGroup.Label>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          color.class,
                          "h-8 w-8 rounded-full border border-black border-opacity-10"
                        )}
                      />
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Sizes */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <p
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Size guide
                </p>
              </div>

              <RadioGroup
                value={selectedSize}
                onChange={setSelectedSize}
                className="mt-4"
              >
                <RadioGroup.Label className="sr-only">
                  Choose a size
                </RadioGroup.Label>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                  {sizes.map((size) => (
                    <RadioGroup.Option
                      key={size.name}
                      value={size}
                      disabled={!size.inStock}
                      className={({ active }) =>
                        classNames(
                          size.inStock
                            ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                            : "cursor-not-allowed bg-gray-50 text-gray-200",
                          active ? "ring-2 ring-indigo-500" : "",
                          "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="span">
                            {size.name}
                          </RadioGroup.Label>
                          {size.inStock ? (
                            <span
                              className={classNames(
                                active ? "border" : "border-2",
                                checked
                                  ? "border-indigo-500"
                                  : "border-transparent",
                                "pointer-events-none absolute -inset-px rounded-md"
                              )}
                              aria-hidden="true"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line
                                  x1={0}
                                  y1={100}
                                  x2={100}
                                  y2={0}
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </span>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
            {/* Quantity */}
            <div className="mt-10">
              <div className="">
                <h3 className="text-sm font-medium text-gray-900 mb-5">
                  Quantity
                </h3>

                <div className="flex items-center col-span-3">
                  <button
                    className="p-3 cursor-pointer bg-gray-300 text-gray-900 hover:bg-gray-100"
                     onClick={() => setQuantity(prev => prev-1 >= 1 ? prev-1 : 1)}
                  >
                    <MinusIcon className="h-6 w-6" />
                  </button>
                  <p className="p-3 w-20 text-center cursor-pointer text-gray-900">
                    {quantity}
                  </p>
                  <button
                    className="p-3 cursor-pointer bg-gray-300 text-gray-900 hover:bg-gray-100"
                     onClick={() => setQuantity(prev => prev+1 <= product.stock ? prev+1 : product.stock)}
                  >
                    <PlusIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              // type="button"
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add to Cart
            </button>
            {/* </form> */}
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>
            {/* highlights */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul className="list-disc space-y-2 pl-4 text-sm">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* product detial */}
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
