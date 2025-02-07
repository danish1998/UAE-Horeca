import React, { useEffect, useState } from "react";
import { Wrapper } from "../../shared/Wrapper";
import { Link, Navigate } from "react-router-dom";
import { Category } from "./Category";
import { apiClient } from "../../utils/apiWrapper";

const AllCategoriesData = ({ categories, title }) => {
  const [maxIndex, setMaxIndex] = useState(0); // To control how many categories to show

  useEffect(() => {
    const updateMaxIndex = () => {
      const width = window.innerWidth;
      if (width >= 1920) {
        setMaxIndex(13); // For very large screens
      } else if (width >= 1830) {
        setMaxIndex(13);
      } else if (width >= 1600) {
        setMaxIndex(11);
      } else if (width >= 1536) {
        setMaxIndex(9);
      } else if (width >= 1400) {
        setMaxIndex(9);
      } else if (width >= 1280) {
        setMaxIndex(9);
      } else if (width >= 1024) {
        setMaxIndex(7); // Medium screens
      } else if (width >= 768) {
        setMaxIndex(5); // Smaller screens
      } else if (width >= 640) {
        setMaxIndex(3); // Smaller screens
      } else {
        setMaxIndex(5); // Very small screens
      }
    };

    updateMaxIndex(); // Set initial value based on window width
    window.addEventListener("resize", updateMaxIndex); // Update maxIndex on window resize
    return () => {
      window.removeEventListener("resize", updateMaxIndex); // Cleanup on component unmount
    };
  }, [window?.location]);

  return (
    <Wrapper>
      {/* Categories Header  */}
      {title == true && (
        <div className="flex items-center justify-between mt-[20px] sm:mt-[60px]">
          <h2 className="text-[16px] text-black-100 font-semibold sm:text-xl md:text-[16px] xl:text-[24px]">
            Shop by Categories
          </h2>
          <Link
            to="/all-categories"
            className="text-gray-700  text-[14px] sm:text-[18px]"
          >
            <h2>All Categories</h2>
          </Link>
        </div>
      )}

      {/* categories List  */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 sm:gap-8 mt-5 sm:mt-8">
          {!!categories &&
            categories.length > 0 &&
            categories?.map((category, index) => {
              return (
                <React.Fragment key={index}>
                  <Category category={category} />
                </React.Fragment>
              );
            })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 sm:gap-8 mt-5 sm:mt-8">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse bg-gray-200 rounded-md h-[260px] w-full flex flex-col justify-center items-center"
            >
              <div className="bg-gray-300 h-[140px] w-[196px] rounded-md"></div>
              <div className="bg-gray-300 h-[20px] w-[120px] mt-4 rounded"></div>
            </div>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(AllCategoriesData);
