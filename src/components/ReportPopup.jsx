import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const ReportPopup = ({ product, setProductDetailPopup }) => {
  return (
    <div>
      <div
        style={{ zIndex: 999 }}
        className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm z"
      >
        <div className="modal-bg absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="modal relative bg-white w-[95%] sm:w-[650px] flex flex-col rounded-lg shadow-lg">
          <div className="flex p-[10px] items-center justify-between bg-[#def9ec] rounded-t-lg">
            <p>Report an issue</p>
            <button
              className="text-[22px]"
              onClick={() => setProductDetailPopup(false)}
            >
              x
            </button>
          </div>
          <div className="flex flex-col p-4 justify-center  bg-gray-100 rounded-lg shadow-md">
            {/* <div className="flex">
              <img
                className="w-24 h-24 rounded-lg object-cover"
                src={product?.images[0]}
                alt="Product"
              />
              <p className="mt-3 text-gray-700 font-medium text-left ml-[10px]">
                {product?.name}
              </p>
            </div> */}
            <div className="mt-4 w-full space-y-3">
              <div className="flex flex-col">
                <label className="text-black font-semibold">
                  Please tell us about the issue:
                </label>
                <select className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select Option</option>
                  <option value="">
                    Some product information is missing. inaccurate or could be
                    improved
                  </option>
                  <option value="">I have an issue with the price</option>
                </select>

                <label className="text-black font-semibold mt-[20px]">
                  Please tell us about the issue:
                </label>
                <select className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select Option</option>
                  <option value="">
                    Price disparity between single and multi-pack
                  </option>
                  <option value="">I have found a lower price</option>
                  <option value="">Discount/coupon error</option>
                  <option value="">Higher shipping costs than expected</option>
                  <option value="">
                    Prices for "used" or "renewed" conditions higher than "new"
                  </option>
                  <option value="">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-black font-semibold">Suggestion:</label>
                <textarea
                  placeholder="Suggestion"
                  type="text"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center justify-end p-[15px]">
              <button
                onClick={() => setProductDetailPopup(false)}
                className="flex m-[10px] items-center justify-center rounded-md font-sans w-[180px] h-[40px] border border-[#666666] text-[16px] text-[#666666] font-medium leading-[16px] text-left underline-offset-auto decoration-slice"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex mb-[5px] bg-[#DEF9EC] items-center hover:text-green-500 justify-center rounded-md font-sans w-[180px] h-[40px] text-[#186737] text-[16px] font-medium leading-[16px] text-left underline-offset-auto decoration-slice"
              >
                Submit
              </button>
              {false ? (
                <InfinitySpin
                  visible={true}
                  height="120"
                  width="120"
                  color="#186737"
                  ariaLabel="infinity-spin-loading"
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
