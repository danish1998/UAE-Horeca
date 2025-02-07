import React from "react";
import Slider from "react-slick";
import { settings } from "../../utils/slicksettings";
import Skeleton from "react-loading-skeleton";

import ProductCard from "../../shared/ProductCard";
const SuggestionSlider = ({ title, productList, productLoader, keys }) => {
  const bigScreenCss =
    "flex grid-cols-5 sm:grid md:grid lg:grid 2xl:grid gap-5 sm:gap-5 sm:grid sm:space-x-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5";

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mx-2 my-[10px] sm:my-8">
        <h2 className=" font-medium ml-[8px] sm:font-semibold text-[16px] sm:text-2xl text-black-100 ">
          {title}
        </h2>
        {/* {window?.innerWidth > 600 && window?.innerWidth < 1024 && (
    <span className="text-gray-700 text-sm">Page 1 of 2</span>
  )}
  {window?.innerWidth > 1024 && window?.innerWidth < 1366 &&(
    <span className="text-gray-700 text-sm">Page 1 of 3</span>
  )}
    {window?.innerWidth > 1366 &&window?.innerWidth < 1600 &&(
    <span className="text-gray-700 text-sm">Page 1 of 4</span>
  )}
    {window?.innerWidth > 1600 && (
    <span className="text-gray-700 text-sm">Page 1 of 4</span>
  )} */}
      </div>
      {window?.innerWidth > 640 && (
        <div className="slider-container" key={keys}>
          <Slider {...settings} className="arrow__wrapper">
            {productList && productList.length > 0
              ? productList.map((product, index) => (
                  <div className="px-2">
                    <ProductCard
                      classes="min-h-[600px]"
                      key={product.id}
                      product={product}
                    />
                  </div>
                ))
              : Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="col-span-1 mt-1 min-h-[400px]"
                  />
                ))}
          </Slider>
        </div>
      )}
      {window?.innerWidth < 640 && (
        <div
          style={
            window.innerWidth < 640
              ? {
                  overflow: "auto",
                  scrollbarWidth: "none", // For Firefox
                  msOverflowStyle: "none", // For Internet Explorer and Edge
                }
              : {}
          }
          className={bigScreenCss}
        >
          {productLoader && productLoader ? (
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="col-span-1 mt-1 min-h-[400px]" />
            ))
          ) : (
            <React.Fragment>
              {productList && productList.length > 0
                ? productList.map((product, index) =>
                    index < 10 ? (
                      <ProductCard
                        key={index}
                        classes="col-span-1 mt-1"
                        product={product}
                      />
                    ) : null
                  )
                : Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="col-span-1 mt-1 min-h-[400px]"
                    />
                  ))}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SuggestionSlider);
