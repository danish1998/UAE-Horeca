import React from "react";
import { useNavigate } from "react-router";

const ReviewCard = ({ reviewData, deleteReview, updateReview }) => {
  const Navigate = useNavigate();
  const deleteReviews = (id) => {
    deleteReview(id);
  };

  const updateReviews = (id, pid) => {
    updateReview(id, pid);
  };

  return (
    <div
      key={reviewData?.product?.id}
      className="border-2 w-[100%] mt-[10px] rounded cursor-pointer"
    >
      <div
        className="flex items-center border-b-2 p-[20px] overflow-x-auto"
        onClick={(e) => {
          e.stopPropagation();
          Navigate(`/product/${reviewData?.product?.id}`);
        }}
      >
        {reviewData?.imageUrls
          ? Object.values(reviewData?.imageUrls).map((img, index) => (
              <img
                key={index}
                className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[110px] lg:h-[110px] ml-[10px] h-auto mr-[10px] object-cover rounded"
                src={img}
                alt={`product image ${index}`}
              />
            ))
          : reviewData?.product?.images?.map((img, index) => {
              return (
                <img
                  key={index}
                  className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[110px] lg:h-[110px] ml-[10px] h-auto mr-[10px] object-cover rounded"
                  src={img}
                  alt={`product image ${index}`}
                />
              );
            })}
      </div>

      <div className="p-[10px]">
        <div className="flex p-[4px]">
          {Array.from({ length: reviewData?.star }).map((_, index) => (
            <img
              key={index}
              className=" ml-[3px]  mr-[3px]"
              src={process.env.PUBLIC_URL + "/icons/star.png"}
            />
          ))}
        </div>
        <p className="font-work-sans text-[18px] mt-[5px] font-medium leading-[24px] text-left decoration-skip-ink-none underline-from-font p-[2px]">
          {reviewData?.product?.name}
        </p>
        <p className="font-work-sans text-[18px] font-normal leading-[24px] text-left decoration-skip-ink-none underline-from-font p-[2px]">
          {reviewData?.comment}
        </p>
        <p className="font-work-sans text-[14px] font-normal leading-[16px] text-left decoration-skip-ink-none underline-from-font p-[2px]">
          Yes, I recommend this product
        </p>
        <div className="flex items-center justify-between ">
          <p className="font-work-sans text-[14px] font-medium leading-[16px] text-left decoration-skip-ink-none underline-from-font text-[#818181] m-[5px]">
            {reviewData?.product?.updated_at?.split("T")[0]}
          </p>
          <div className="flex flex-row items-center justify-between">
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation
                  updateReviews(reviewData);
                }}
                className="font-work-sans border-2 mr-[10px] hover:bg-[#DEF9EC] hover:border-white hover:text-[#186737] rounded-md p-[10px] text-[#808080] text-[13px] font-medium leading-[16px] text-left decoration-skip-ink-none underline-from-font text-center"
              >
                Update Review
              </button>
            </div>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation
                  deleteReviews(reviewData.id);
                }}
                className="font-work-sans border-2 mr-[10px] hover:bg-[#DEF9EC] hover:border-white hover:text-[#186737] rounded-md p-[10px] text-[#808080] text-[13px] font-medium leading-[16px] text-left decoration-skip-ink-none underline-from-font text-center"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
