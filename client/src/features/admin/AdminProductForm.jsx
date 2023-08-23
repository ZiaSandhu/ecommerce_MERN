import { useState, useCallback, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { filterBrands } from "../../store/productSlice";
import { addProductApi, updateProductApi } from "../../api/internal/productApi";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DialogBox from "../DialogBox";

export default function AdminProductForm() {
  const location = useLocation();
  const dispatch = useDispatch();
  let product = location.state?.product;
  const categories = useSelector((state) => state.product.categories);
  const [selectedCategory, setSelectedCategory] = useState("smartphones");
  const brands = useSelector((state) => state.product.brands);
  const [thumbnail, setThumbnail] = useState(product?.thumbnail);
  const [images, setImages] = useState(product?.images);


  const [status, setStatus] = useState(null)
  useEffect(() => {
    dispatch(filterBrands(selectedCategory));
  }, [selectedCategory,dispatch]);
  const {
    register,
    handleSubmit,
    setValue,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      title: product?.title,
      description: product?.description,
      price: product?.price,
      category: product?.category,
      brand: product?.brand,
      discountPercentage: product?.discountPercentage,
      stock: product?.stock,
    }
  });
  const clearAllFields = () => {
    
    product = null
    setValue('title','')
    setValue('description','')
    setValue('category','smartphones')
    setValue('price',undefined)
    setValue('stock',undefined)
    setValue('discountPercentage',0)
    setImages(null)
    setThumbnail(null)
  };
  const onDropThumbnail = useCallback((acceptedFiles) => {
    console.log("Thumbnail files:", acceptedFiles[0]);
    const reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);
    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
  }, []);

  const onDropImages = useCallback((acceptedFiles) => {
    console.log("Images files:", acceptedFiles);
    let imagesArray=[]
    let files = [...acceptedFiles]
    for (let index = 0; index < files.length; index++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[index]);
      reader.onloadend = () => {
        imagesArray.push(reader.result);
      };
    };
    setImages(imagesArray)
  }, []);

  const thumbnailDropzone = useDropzone({
    onDrop: onDropThumbnail,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });
  const imagesDropzone = useDropzone({
    onDrop: onDropImages,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    multiple: true,
  });

  const addProduct = async (data) => {
    let updatedData = {
      ...data, thumbnail, images,
      price: Number(data.price),
      stock: Number(data.stock),
      discountPercentage: Number(data.discountPercentage),
    }
    let res;
    try {
      if(product){
        res = await updateProductApi(product._id,updatedData)
      }else{
        console.log('add')
        res = await addProductApi(updatedData);
      }
    } catch (error) {
      res = error;
    }
    clearAllFields()
    setStatus(res.data.msg)
  };

  if(status){
    setTimeout(() => {
      setStatus(null)
    }, 3000);
  }
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 lg:px-8 bg-gray-100">
      <form onSubmit={handleSubmit(addProduct)} encType="multipart/form-data">
        <div className="border-b border-gray-900/10 pb-12 ">
          {status && 
            <DialogBox heading={status} />
          }
          <h2 className="text-3xl font-semibold leading-7 text-gray-900">
            {product ? "Edit Product" : "Add Product"}
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* title */}
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    {...register("title", { min: 5 })}
                    id="title"
                    className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900  focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            {/* description */}
            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  {...register("description", { min: 5 })}
                  rows={3}
                  placeholder="Write description of product."
                  className="block w-full pl-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* category */}
            <div className="sm:col-span-2">
              <div className="flex justify-between">
                <label
                  htmlFor="categroy"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Categroy
                </label>
                {/* todo add category feture as well as add brand feature */}
                <p>Add category</p>
              </div>

              <div className=" mt-2">
                <select
                  id="categroy"
                  {...register("category")}
                  onChange={(e) => setSelectedCategory([e.target.value])}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  {categories &&
                    categories.map((item, index) => (
                      <option key={index} value={item.value}>
                        {" "}
                        {item.label}{" "}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* brand */}
            <div className="sm:col-span-2 ">
              <div className="flex justify-between">
                <label
                  htmlFor="brands"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brands
                </label>
                <p>Add brands</p>
              </div>
              <div className="mt-2">
                <select
                  id="brand"
                  {...register("brand")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  {brands &&
                    brands.map((item, index) => (
                      <option key={index} value={item.value}>
                        {" "}
                        {item.label}{" "}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* price */}
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  {...register("price", { min: 0 })}
                  min={0}
                  type="number"
                  className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* discount percentage */}
            <div className="sm:col-span-2">
              <label
                htmlFor="discountPercentage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Discount Percentage
              </label>
              <div className="mt-2">
                <input
                  id="discountPercentage"
                  {...register("discountPercentage", { min: 0, max: 100 })}
                  defaultValue={0}
                  type="number"
                  step={0.01}
                  className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* stock */}
            <div className="sm:col-span-2">
              <label
                htmlFor="stock"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Stock
              </label>
              <div className="mt-2">
                <input
                  id="stock"
                  {...register("stock", { min: 0 })}
                  type="number"
                  className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* thumbnail */}
            <div className="col-span-full">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium leading-6  text-gray-900"
              >
                Thumbnail
              </label>
              <div className="mt-2 flex justify-center rounded-lg h-64 border border-dashed border-gray-900/25 px-6 py-10">
                <div
                  className="text-center w-full"
                  {...thumbnailDropzone.getRootProps()}
                >
                  <input
                    {...thumbnailDropzone.getInputProps()}
                  />
                  {!thumbnail ? (
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="relative inline-block bg-white">
                      <img
                        className="mx-auto h-24 w-24 text-gray-300 rounded "
                        src={thumbnail}
                        alt=""
                      />
                      {/* todo implement cancel option */}
                      <button className="absolute top-0 right-0 z-20 cursor-default">
                        <XMarkIcon className="h-5 w-5 hover:text-red-500" />{" "}
                      </button>
                    </div>
                  )}
                  <p className=" text-sm relative  rounded-md bg-transparent ">
                    <span className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-500">
                      Upload a file
                    </span>
                    &nbsp; or drag and drop
                  </p>
                  <p className="text-xs leading-5 text-gray-600">
                    Allowed file types:{" "}
                    <span className="text-gray-900">PNG, JPG, GIF</span>
                  </p>
                  <p className="text-xs leading-5 text-gray-600">
                    Other file types will be rejected
                  </p>
                </div>
              </div>
            </div>
            {/* images */}
            <div className="col-span-full">
              <label
                htmlFor="images"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Images
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div
                  className="text-center w-full"
                  {...imagesDropzone.getRootProps()}
                >
                  <input
                    {...imagesDropzone.getInputProps()}
                  />
                  {!images ? (
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="inline-flex gap-4">
                      {images.map((item,index) => (
                        <div key={index} className="relative inline-block bg-white">
                          <img
                            className="mx-auto h-24 w-24 text-gray-300 rounded "
                            src={item}
                            alt=""
                          />
                          {/* todo implement cancel option */}
                          <button className="absolute top-0 right-0 z-20 cursor-default">
                            <XMarkIcon className="h-5 w-5 font-semibold hover:text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className=" text-sm relative  rounded-md bg-transparent ">
                    <span className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-500">
                      Upload a file
                    </span>
                    &nbsp; or drag and drop
                  </p>
                  <p className="text-xs leading-5 text-gray-600">
                    Allowed file types:
                    <span className="text-gray-900">PNG, JPG, GIF</span>
                    <br /> Max 4 Files.
                  </p>
                  <p className="text-xs leading-5 text-gray-600">
                    Other file types will be rejected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={clearAllFields}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
