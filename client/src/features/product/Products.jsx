import React, { useState, Fragment, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import {NavLink} from 'react-router-dom'

import {setProducts, setBrand, setCategory, setAllProducts} from '../../store/productSlice'
import { getProducts,getAllProduct } from "../../api/internal/productApi";

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: '-1' },
  { name: 'Price: Low to High', sort: 'price', order: '1' },
  { name: 'Price: High to Low', sort: 'price', order: '-1' },
  { name: 'Title: A-Z', sort: 'title', order: '1' },
  { name: 'Title: Z-A', sort: 'title', order: '-1' },
]



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Products() {
  const dispatch = useDispatch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [paginate,setPaginate] = useState({
    _page:1,
    _limit:10,
  })


  const handleFilter = (e,section) => {
    let newFilter = {...filter}
    if (e.target.checked) {
      if (!newFilter.hasOwnProperty(section.id)) {
        newFilter[section.id] = [e.target.value];
      } else {
        newFilter[section.id].push(e.target.value);
      }
    }
    else{
      if (newFilter.hasOwnProperty(section.id)) {
        const index = newFilter[section.id].indexOf(e.target.value);
        if (index !== -1) {
          newFilter[section.id].splice(index, 1);
          if (newFilter[section.id].length === 0) {
            delete newFilter[section.id];
          }
        }
      }
    }
    if(section.id === 'category'){
      console.log(newFilter)
      dispatch(setBrand(newFilter.category))
    }
    setPaginate(prev => ({...prev, _page:1}) )
    setFilter(newFilter)
  };
  const handleSort = async(e,option) => {
    let sort = {
      _sort : option.sort,
      _order : option.order
    }
    setPaginate(prev => ({...prev, _page:1}) )
    setSort(sort)    
  };
  const handlePagination = async(page) => {
    let max = Math.ceil(totalProducts/paginate._limit)
    if(page>=1 && page<=max){
      setPaginate(prev => ({...prev, _page:page}) )
    }
  };
  useEffect(() => {
    async function fetchproducts() {
      let response = await getProducts(filter,sort,paginate);      
      if (response.status === 200){
        let payload = {
          products: response.data.products,
          totalProducts: response.data.totalItem
        }
        dispatch(setProducts(payload));
      }
       
    }
    fetchproducts();
  }, [dispatch,filter,sort,paginate]);

  useEffect(
    ()=>{
      async function getFeatures () {
        let response = await getAllProduct();
        dispatch(setAllProducts(response.data.products))
        dispatch(setCategory())
        dispatch(setBrand())
      };
      getFeatures();
    },
    []
  )
  const products = useSelector((state) => state.product.products);
  const totalProducts = useSelector((state) => state.product.totalProducts);
  const categories = useSelector((state) => state.product.categories);
  const brands = useSelector((state) => state.product.brands);
  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories
    },
    {
      id: "brand",
      name: "Brands",
      options: brands
    },
  ];
  return (
    <div>
      <div className="bg-white">
        <div>
          {/* Mobile filter dialog */}
          <MobileFilter filters={filters} handleFilter={handleFilter} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} />

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                All Products
              </h1>

              {/* Sorting */}
              <Sorting
                sortOptions={sortOptions}
                handleSort={handleSort}
                setMobileFiltersOpen={setMobileFiltersOpen}
              />
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <DesktopFilter filters={filters} filter={filter} handleFilter={handleFilter} />

                {/* Product grid */}
                {products.length > 0 ? <ProductGrid products={products}/> : <p>No Product to Display</p>}
                {/* //product grid end */}
              </div>
            </section>

            {/* Product Pagination */}
            <Pagination handlePagination={handlePagination} paginate={paginate} totalProducts={totalProducts} />
          </main>
        </div>
      </div>
    </div>
  );
}
function ProductGrid({products}) {
  return (
    <div className="lg:col-span-3">
      {" "}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-1 sm:px-6 sm:py-1 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="group relative border-solid border-2 border-black-300 p-2"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <NavLink to={`/product/${product._id}`} >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </NavLink>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.rating}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function MobileFilter({filters,handleFilter, mobileFiltersOpen, setMobileFiltersOpen}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={optionIdx}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  onChange={(e) => handleFilter(e, section)}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
function DesktopFilter({filters,filter,handleFilter}) {
  return (
    <form className="hidden lg:block">
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
            {/* {console.log("filter rendered")}   */}
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        onChange={(e) => handleFilter(e, section)}
                        checked={(filter[section.id] || []).includes(option.value)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}
function Pagination({handlePagination, paginate, totalProducts}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <div
          onClick={(e) => handlePagination(paginate._page - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </div>
        <div
          onClick={(e) => handlePagination(paginate._page + 1)}
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
              {(paginate._page - 1) * paginate._limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {paginate._page * paginate._limit > totalProducts
                ? totalProducts
                : paginate._page * paginate._limit}
            </span>{" "}
            of <span className="font-medium"> {totalProducts} </span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={(e) => handlePagination(paginate._page - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            {Array.from({
              length: Math.ceil(totalProducts / paginate._limit),
            }).map((item, index) => (
              <div
                key={index}
                onClick={(e) => handlePagination(index + 1)}
                className={`relative hidden items-center px-4 py-2 text-sm font-semibold ${
                  index + 1 === paginate._page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900"
                } ring-1 ring-inset ring-gray-300 hover:bg-gray-300 hover:text-black  md:inline-flex cursor-pointer`}
              >
                {index + 1}
              </div>
            ))}
            <div
              onClick={(e) => handlePagination(paginate._page + 1)}
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
function Sorting({sortOptions,handleSort,setMobileFiltersOpen}) {
  return (
    <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      Sort
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <Menu.Item key={option.name}>
                            {({ active }) => (
                              <p
                                onClick={e => handleSort(e,option)}
                                className={classNames(
                                  option.current
                                    ? "font-medium text-gray-900"
                                    : "text-gray-500",
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm cursor-pointer"
                                )}
                              >
                                {option.name}
                              </p>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  type="button"
                  className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
                >
                  <span className="sr-only">View grid</span>
                  <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
  )
}