import React from "react";
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid';


const Quantity = ({ amount=1,setAmount }) => {
  return (
    <div className="">
      <h3 className="text-sm font-medium text-gray-900 mb-5">Quantity</h3>

      <div className="flex items-center col-span-3">
        <button
          className="p-3 cursor-pointer bg-gray-300 text-gray-900 hover:bg-gray-100"
          //  onClick={()x => setDecrease()}
        >
          <MinusIcon className="h-6 w-6" />
        </button>
        <p className="p-3 w-20 text-center cursor-pointer text-gray-900">{amount}</p>
        <button
          className="p-3 cursor-pointer bg-gray-300 text-gray-900 hover:bg-gray-100"
          // onClick={() => setIncrease()}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Quantity;