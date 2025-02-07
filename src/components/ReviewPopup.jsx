import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiClient } from "../utils/apiWrapper";
import { InfinitySpin } from "react-loader-spinner";
import { notify } from "../utils/notify";
const ReviewPopup = ({
  setShowPopup,
  popupHeading,
  id,
  setUpdateReviews,
  updateReviews,
  reviewId,
  selectedReviewedData,
}) => {
  let url = "add-customer-reviews";
  if (reviewId) {
    url = `customer-reviews-update/${reviewId}`;
  }
  const [ratingError, setRatingError] = useState("");
  const [loader, setLoader] = useState(false);
  const [getData, setData] = useState([]);
  const [rating, setRating] = useState(selectedReviewedData && selectedReviewedData.star);
  const [hoveredRating, setHoveredRating] = useState(
    !!selectedReviewedData && selectedReviewedData
      ? selectedReviewedData.star
      : 0
  );

  // Handle click on a star
  const handleClick = (index) => {
    setRating(index);
    setRatingError("");
  };

  // Handle hover event
  const handleMouseEnter = (index) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  // Render the stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || rating); // If hovered or selected, fill the star
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 cursor-pointer transition-all duration-200 ${isFilled ? "text-yellow-500" : "text-gray-300"
            }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          <path
            d="M12 17.75l6.125 3.25-1.625-7.25 5.25-4.5-7.25-.625L12 2 8.5 8.75l-7.25.625 5.25 4.5-1.625 7.25L12 17.75z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return stars;
  };

  const handleForm = async (data) => {
    try {
      setLoader(true);
      const formData = new FormData();
      
      // Append basic data
      formData.append("star", rating);
      formData.append("product_id", id);
      formData.append("comment", data.comment);

      // Handle image files
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      }

      if (reviewId) {
        formData.append("_method", "PUT");
      }

   

      const response = await apiClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
   
      setData(response.data);
      if (response.data.success) {
        setUpdateReviews(!updateReviews);
        notify("", response.data.message);
        setShowPopup(false);
      
      }
    } catch (error) {
      console.error("Error:", error);
      notify("Error", error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoader(false);
    }
  };

 const schema = yup.object({
    comment: yup.string().required("Comment is required"),
    images: yup
      .mixed()
      .test("fileSize", "Each file must be less than 2MB", function (value) {
        if (!value || !value.length) return true;
        return Array.from(value).every(file => file.size <= 2000000);
      })
      .test("fileType", "Only JPG and PNG files are allowed", function (value) {
        if (!value || !value.length) return true;
        return Array.from(value).every(file => 
          ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
        );
      }),
  });


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (!rating) {
      setRatingError("Please select a rating");
      return;
    }
    handleForm(data);
    reset();
    setRating(0);
    setHoveredRating(0);
  };

  useEffect(() => {
   
    if (getData.success) {
    
      notify("", getData.message);
      setShowPopup(false);
      setUpdateReviews(!updateReviews);
    }
  }, [getData]);
 
 
 
  return (
    <div>
      <div
        style={{ zIndex: "999" }}
        className="fixed inset-0 p-[10px] flex items-center justify-center z-999 backdrop-blur-sm"
      >
        <div className="modal-bg absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="modal relative bg-white w-[95%] sm:w-[650px] flex flex-col rounded-lg shadow-lg">
          <div className="flex items-center justify-between bg-[#DEF9EC] rounded-t-lg p-2">
            <p className="font-sans p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
              {popupHeading}
            </p>
            <button onClick={() => setShowPopup(false)}>X</button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            {getData.messa}
            <div className="p-[5px]">
              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Images :
                </p>
                <input
                  type="file"
                  multiple
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  {...register("images")}
                />
              {errors.images && (
                  <p className="text-red-500 ml-[2%]">{errors.images.message}</p>
                )}
              </div>
              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Comment :
                </p>
                <textarea
                  defaultValue={
                    selectedReviewedData && selectedReviewedData?.comment
                  }
                  type="text"
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  placeholder="Enter your comment"
                  {...register("comment")}
                />
             {errors.comment && (
                  <p className="text-red-500 ml-[2%] mb-[2%]">{errors.comment.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-10">
                {renderStars()}
              </div>
              {ratingError && (
                  <p className="text-red-500 ml-[2%] mt-1">{ratingError}</p>
                )}
              <div className="flex items-center justify-end p-[15px]">
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex m-[10px] items-center justify-center rounded-md font-sans w-[180px] h-[40px] border border-[#666666] text-[16px] text-[#666666] font-medium leading-[16px] text-left underline-offset-auto decoration-slice"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex mb-[5px] bg-[#DEF9EC] items-center justify-center rounded-md font-sans w-[180px] h-[40px] text-[#186737] text-[16px] font-medium leading-[16px] text-left underline-offset-auto decoration-slice"
                >
                  Submit
                </button>
                {loader ? (
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;
