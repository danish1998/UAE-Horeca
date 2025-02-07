import React, { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import { apiClient } from "../../../utils/apiWrapper";
import ProductCard from "../../../shared/ProductCard";
const CommonProducts = ({ updateCommonProduct }) => {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const fetchProducts = async () => {
    setLoader(true);
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await apiClient.get(
        `${authToken ? "/products" : "/products-guest"}`
      );
      setProducts(response.data.data.data);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [updateCommonProduct]);
  const smallScreenCss =
    "flex grid-cols-5 sm:grid md:grid lg:grid 2xl:grid gap-5 sm:gap-5 sm:grid sm:space-x-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5";

  const bigScreenCss =
    "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 gap-5 w-full";

  return (
    <>
      <div className="block">
        <div className="mb-10 mt-[20px] p-[10px]">
          <img
            className="block sm:hidden h-[160px] w-[100vw] rounded-md"
            src={process.env.PUBLIC_URL + "/images/RegistrationProfile.png"}
          />
          <div className="flex items-center justify-between mx-2 my-[10px] sm:my-8">
            <h2 className=" font-medium sm:font-semibold text-[16px] sm:text-2xl text-black-100 ">
              Products you may also like
            </h2>
          </div>
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
            className={window?.innerWidth > 640 ? bigScreenCss : smallScreenCss}
          >
            {loader ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="col-span-1 mt-1 min-h-[550px]"
                />
              ))
            ) : (
              <React.Fragment>
                {window?.innerWidth < 640 ? (
                  <>
                    {products && products.length > 0 ? (
                      products.map((product, index) =>
                        index < 10 ? (
                          <ProductCard
                            key={index}
                            classes="col-span-1 mt-1"
                            product={product}
                          />
                        ) : null
                      )
                    ) : (
                      <p className="col-span-5 font-semibold text-center text-base">
                        No Product Found
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {/* <div className="grid grid-cols-1 gap-4 w-[85vw] sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> */}
                    {products && products.length > 0 ? (
                      products.map((product, index) =>
                        index < 10 ? (
                          <ProductCard
                            key={index}
                            classes="col-span-1 mt-1"
                            product={product}
                          />
                        ) : null
                      )
                    ) : (
                      <p className="col-span-5 font-semibold text-center text-base">
                        No Product Found
                      </p>
                    )}
                    {/* </div> */}
                  </>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="mb-10">
          <div className="flex items-center justify-between mx-2 my-[10px] sm:my-8">
            <h2 className=" font-medium sm:font-semibold text-[16px] sm:text-2xl text-black-100 ">
              Inspired by your browsing history
            </h2>
          </div>
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
            className={window?.innerWidth > 640 ? bigScreenCss : smallScreenCss}
          >
            {loader ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="col-span-1 mt-1 min-h-[550px]"
                />
              ))
            ) : (
              <React.Fragment>
                {window?.innerWidth < 640 ? (
                  <>
                    {products && products.length > 0 ? (
                      products.map((product, index) =>
                        index < 10 ? (
                          <ProductCard
                            key={index}
                            classes="col-span-1 mt-1"
                            product={product}
                          />
                        ) : null
                      )
                    ) : (
                      <p className="col-span-5 font-semibold text-center text-base">
                        No Product Found
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {/* <div className="grid grid-cols-1 gap-4 w-[85vw] sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"> */}
                    {products && products.length > 0 ? (
                      products.map((product, index) =>
                        index < 10 ? (
                          <ProductCard
                            key={index}
                            classes="col-span-1 mt-1"
                            product={product}
                          />
                        ) : null
                      )
                    ) : (
                      <p className="col-span-5 font-semibold text-center text-base">
                        No Product Found
                      </p>
                    )}
                    {/* </div> */}
                  </>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(CommonProducts);
