import {
  TrashIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { updateUser } from "../../api/internal/userApi";
import { updateUserState } from "../../store/userSlice";

const UserProfile = () => {
  const user = useSelector((state) => state.user.user);
  const { email, username, shippingAddresses } = user;
  const [openDialogue, setOpenDialogue] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [address, setAddress] = useState(null);
  
  return (
    <div className="mx-auto mt-10 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h3 className="text-3xl font-semibold leading-7 text-gray-900">
          User Information
        </h3>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Username
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {username}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {email}
            </dd>
          </div>
          <div className="">
            <div className="flex justify-between mt-3">
              <h2 className=" px-2 text-base font-semibold leading-7 text-gray-900">
                Saved Addresses
              </h2>
              <button
                type="button"
                onClick={() => {
                  setAddress(null);
                  setOpenForm(true);
                }}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-200 hover:text-blue-900 "
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 opacity-70" />
                Add Address
              </button>
            </div>

            {shippingAddresses.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-100">
                {shippingAddresses.map((add, index) => (
                  <li key={index} className="px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                      <div className="min-w-0 col-span-1 lg:col-span-2">
                        {/* <p className="text-sm font-semibold leading-6 text-gray-900">
                        {add._id}
                      </p> */}
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {add.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {add.phone}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {add.email}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {add.street} {add.city} {add.province}
                          <br />
                          {add.country}
                          {add.postalcode}
                        </p>
                      </div>
                      <div className="">
                        <button
                          type="button"
                          onClick={() => {
                            setAddress(add);
                            setOpenForm(true);
                          }}
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-organge-50 hover:text-blue-700 "
                        >
                          <PencilSquareIcon className="-ml-0.5 mr-1.5 h-5 w-5 opacity-70" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddress(add);
                            setOpenDialogue(true);
                          }}
                          className="inline-flex items-center rounded-md bg-white mx-3 px-3 py-2 text-sm font-semibold text-gray-900  shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-100 hover:text-red-900"
                        >
                          <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5 opacity-70" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center mt-5 text-sm">No Address Saved</p>
            )}
          </div>
        </dl>
        {openDialogue && <DialogueBox
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
          address={address}
          userId={user.id}
        />}
        {openForm && <UpdateForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          address={address}
          userId={user.id}
        />}
      </div>
    </div>
  );
};
const DialogueBox = ({ openDialogue, setOpenDialogue,address, userId }) => {
  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch()
  const handleDelete = async() => {
    //api call
    setOpenDialogue(false)
    let data = {
      userId,
      addressId:address._id,
      action:"deleteShoppingAddress"
    }
    let res = await updateUser(data);
    if(res.status === 200){
      dispatch(updateUserState(res.data.updatedUser))
    }
    else{
      // todo set error later
      return
    }
  }
  return (
    <Transition.Root show={openDialogue} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpenDialogue}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete Address
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this Address ?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpenDialogue(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
const UpdateForm = ({ openForm, setOpenForm,userId, address }) => {
  const dispatch = useDispatch()
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm(
    { defaultValues:{
      name: address?.name,
      email: address?.email,
      phone: address?.phone,
      country: address?.country,
      street: address?.street,
      region: address?.region,
      postalcode: address?.postalcode,
      city: address?.city
    }}
  );
async function onSubmit(data) {
  let newUser 
  if(!address){
    newUser = {
      userId,
      shippingAddress: data ,
      action:'push'
    };
  }
  else{
    newUser = {
      userId,
      addressId: address._id,
      shippingAddress: data,
      action: 'update'
    }
  }
  let res = await updateUser(newUser);
  if(res.status === 200){
    dispatch(updateUserState(res.data.updatedUser))
    // todo set success message
    closeForm()
  }
  else{
    // todo set error later
    return
  }
  reset()
}
  const closeForm = () => {
    reset()
    setOpenForm(false)
  }
  return (
    <Transition.Root show={openForm} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeForm}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className=" w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={() => setOpenForm(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div>
                    <h2 className="text-2xl w-full font-semibold leading-7 text-gray-900">
                      Update Address
                    </h2>
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
                              type="text"
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
                              name="country"
                              autoComplete="country-name"
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
                          type="button"
                          onClick={() => setOpenForm(false)}
                          className="text-sm font-semibold leading-6 text-gray-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          {address ?"Update Address" :"Add Address"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default UserProfile;
