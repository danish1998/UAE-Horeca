import React from "react";
import { formatDate, formatDateString } from "../../../../utils/formatDate";
const AllOrdersBox = ({ data, id, setImageView, setShowPopup, navigation }) => {
  const navigations = (data) => {
    navigation({ state: { order_id: data } });
  };
  const ordersImages = data?.products?.map((item) => {
    return item?.images;
  });

  return (
    <div key={id} className="border-2 w-[100%] rounded p-[10px] mb-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="hidden md:hidden lg:block border-r-2 h-[55px] p-[10px] ml-[10px] mr-[10px]">
            <span className="font-sans  text-center text-base font-normal leading-6 text-left text-[#666666] decoration-clone">
              Order Number
            </span>
            <p className="font-sans text-base font-normal leading-6 text-left text[#030303] decoration-slice">
              {data?.code}
            </p>
          </div>
          <div className="border-none sm:border-r-2 sm:border-solid h-[55px] p-[0px] sm:p-[10px] ml-[10px] mr-[10px]">
            <span className="hidden md:hidden lg:block font-sans text-center text-base font-normal leading-6 text-left text-[#666666] decoration-clone">
              Created date
            </span>
            <p className="font-sans text-[12px] sm:mt-[0px] sm:text-base font-normal leading-6 text-left text[#030303] decoration-slice">
              {formatDate(data?.updated_at)}
            </p>
            <p className="lg:hidden xl:hidden font-sans text-[12px] sm:text-base font-normal leading-6 text-left text[#030303] decoration-slice">
              {data?.code}
            </p>
          </div>
          <div className="hidden md:hidden lg:block border-r-2 h-[55px] p-[10px] ml-[10px] mr-[10px]">
            <span className="font-sans text-center text-base font-normal leading-6 text-left text-[#666666] decoration-clone">
              Payment method
            </span>
            <p className="font-sans text-base font-normal leading-6 text-left text[#030303] decoration-slice capitalize capitalize">
              Online / Cash
            </p>
          </div>
          <div className="hidden md:hidden lg:block border-r-2 h-[55px] text-center p-[10px] ml-[10px] mr-[10px]">
            <span className="font-sans text-center text-base font-normal leading-6 text-left text-[#666666] decoration-clone">
              Order status
            </span>
            <p className="font-sans text-base font-normal leading-6 text-left text[#030303] decoration-slice capitalize">
              {data?.status?.value}
            </p>
          </div>
          <div className="hidden md:hidden lg:block border-r-2 h-[55px] text-center p-[10px] ml-[10px] mr-[10px]">
            <span class="font-sans text-center text-base font-normal leading-6 text-left text-[#666666] decoration-clone">
              Payment Status
            </span>
            <p className="font-sans text-base font-normal leading-6 text-left text[#030303] decoration-slice capitalize">
              Pending
            </p>
          </div>
        </div>
        <div className="flex flex-col p-[15px] ">
          <p className="hidden md:hidden lg:block font-sans mb-[4px] text-base text-right font-light leading-[24px] text-left text-[#666666] decoration-0">
            Order Total
          </p>
          <p className="lg:hidden xl:hidden font-sans text-[12px] bg-[#E2E8F0] px-[10px] rounded-full text-black text-right font-light leading-[24px] text-left text-[#666666] decoration-0">
            In Progress
          </p>
          <p className="flex font-sans text-[13px] sm:text-[14px] font-normal leading-[24px] text-left text-[#666666] decoration-0">
            USD &nbsp;
            <span className="hidden md:hidden lg:block font-sans text-[22px] font-semibold leading-[24px] text-left text-[black] decoration-0">
              {data?.amount.split(".")[0]}
            </span>
            <span className="lg:hidden xl:hidden ml-[5px] font-sans text-[13px] font-semibold leading-[24px] text-left text-[black] decoration-0">
              {data?.amount.split(".")[0]}
            </span>
            .{data?.amount.split(".")[1]}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center p-[0px]">
            {data?.products.slice(0, 2)?.map((item, index) => {
              return (
                <div
                  className="relative p-[5px] m-[5px] rounded border"
                  key={index}
                >
                  <img
                    className="h-[30px] sm:h-[42px]"
                    src={item?.images[0]}
                    alt="Product"
                    onClick={() => {
                      setImageView(item?.images[0]);
                      setShowPopup(true);
                    }}
                  />
                  <span className="flex items-center justify-center absolute w-[20px] h-[20px] top-[-10px] right-[-10px] bg-[#186737] text-white text-xs font-bold rounded-full px-2">
                    {item?.qty}
                  </span>
                </div>
              );
            })}

            {data?.products?.length > 2 && (
              <div className="w-12 h-12 bg-[#D9D9D9] rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">
                  + {data?.products?.length - 2}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-4 md:p-4">
          <div className="p-1 sm:p-2 md:p-1  rounded px-4 sm:px-6 text-white bg-[#186737] mx-auto">
            <button
              onClick={() => navigations(data?.code)}
              className="font-work-sans w-[100px] sm:w-[122px] h-[30px] text-[14px] sm:text-[16px] font-normal text-center underline-from-font no-underline-skip"
            >
              Order Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersBox;
