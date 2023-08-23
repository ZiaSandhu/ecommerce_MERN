import { InformationCircleIcon } from "@heroicons/react/24/solid";
export default function DialogBox({heading}) {
  return (
    <div className="fixed z-50 left-1/2 -translate-x-1/2 rounded-lg bg-white text-left shadow-xl">
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="flex">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <InformationCircleIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mt-3 text-center flex items-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3
              className="text-base font-semibold leading-6 text-gray-900"
            >
              {heading} 
            </h3>
          </div>
        </div>
      </div>
      {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div> */}
    </div>
  );
}
