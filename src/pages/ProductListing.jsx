import React, { useEffect, useState } from "react";
import { Wrapper } from "../shared/Wrapper";
import { Breadcrumb } from "../shared/Breadcrumb";
import { Menu, MenuItem } from "@szhsin/react-menu";
import MultiRangeSlider from "multi-range-slider-react";
import { Pagination } from "../shared/Pagination";
import Skeleton from "react-loading-skeleton";
import { apiClient } from "../utils/apiWrapper";
import { useLocation, useNavigate } from "react-router";
import { IoClose } from "react-icons/io5";
import Slider from "react-slick";
import { settings } from "../utils/slicksettings";
import ProductCard from "../shared/ProductCard";
const ProductListing = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  const [page, setPage] = useState("1");
  const [perPage, setPerPage] = useState("50");
  const [loader, setLoader] = useState(true);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceMin, setPriceMin] = useState(10);
  const [priceMax, setPriceMax] = useState(20000);
  const [lengthMin, setLengthMin] = useState("");
  const [lengthMax, setLengthMax] = useState("");
  const [widthMin, setWidthMin] = useState("");
  const [widthMax, setWidthMax] = useState("");
  const [heightMin, setHeightMin] = useState("");
  const [heightMax, setHeightMax] = useState("");
  const [selectedReview, setSelectedReview] = useState();
  const [selectedBrands, setSelectedBrands] = useState({});
  const [priceRangeBool, setPriceRangeBool] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  const [paginationData, setPaginationData] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortByText, setSortByText] = useState("Default Sorting");
  const [minDelivery, setMinDelivery] = useState(0);
  const [maxDelivery, setMaxDelivery] = useState(10);
  const [selectedDelivery, setSelectedDelivery] = useState();
  const [selectedMinPrice, setSelectedMinPrice] = useState();
  const [selectedMaxPrice, setSelectedMaxPrice] = useState();
  const [openFilterPopup, setOpenFilterPopup] = useState(false);

  const breadcrumb = [
    {
      url: "/",
      title: "Home",
    },
    {
      title: "Products",
    },
  ];

  const fetchProducts = async () => {
    const authToken = localStorage.getItem("authToken");
    setLoader(true);
    try {
      let search = searchQuery ? searchQuery : "";

      // Get selected brand IDs by filtering out brands that are checked (true)
      const selectedBrandIds = Object.keys(selectedBrands).filter(
        (brandId) => selectedBrands[brandId] === true
      );

      const params = {
        per_page: perPage,
        page: page,
        ...(selectedReview && { rating: selectedReview }),
        ...(selectedBrandIds.length > 0 && {
          brand_id: selectedBrandIds.join(","),
        }), // Use selectedBrandIds as a comma-separated string
        ...(search && { search: search }),
      };

      if (sortBy === "asc" || sortBy === "desc") {
        params.sort_direction = sortBy;
        params.sort_by = "sale_price";
      }
      if (selectedDelivery) {
        params.delivery_days = selectedDelivery;
      }

      if (selectedMinPrice) {
        params.price_min = selectedMinPrice;
      }
      if (selectedMaxPrice) {
        params.price_max = selectedMaxPrice;
      }

      const response = await apiClient.get(
        `${authToken ? "/product-listing" : "/product-public-listing-guest"}`,
        { params }
      );

      setProducts(response.data.data.data);
      setPaginationData(response.data.data);
      setLengthMin(response.data.length_min);
      setLengthMax(response.data.length_max);
      setWidthMin(response.data.width_min);
      setWidthMax(response.data.width_max);
      setHeightMin(response.data.height_min);
      setHeightMax(response.data.height_max);
      setBrands(response.data.brands);
      setCategories(response.data.categories);
      setMinDelivery(response.data.delivery_min);
      setMaxDelivery(response.data.delivery_max);

      setLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const bigScreenCss =
    "flex grid-cols-5 sm:grid md:grid lg:grid 2xl:grid gap-5 sm:gap-5 sm:grid sm:space-x-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchProducts();
  }, [
    page,
    perPage,
    selectedReview,
    selectedBrands,
    priceRangeBool,
    location.search,
    sortBy,
    selectedDelivery,
    selectedMinPrice,
    selectedMaxPrice,
  ]);

  // useEffect(() => {}, [sortBy, perPage]);
 
  return (
    <div>
      <div
        style={{ zIndex: 999 }}
        className={`lg:hidden xl:hidden md:hidden w-[80vw] h-[100vh] p-5 bg-[white] border absolute z-999 mt-[-215px] 
          ${openFilterPopup ? "translate-x-[0%]" : "translate-x-[-100%]"} 
          transition-transform duration-300 ease-in-out`}
      >
        <div className="flex p-3 items-center justify-between border-b border-gray">
          <p className="text-[16px] leading-[18px] font-bold">Filters</p>
          <p onClick={() => setOpenFilterPopup(false)}>x</p>
        </div>
        <div className="flex p-[12px] flex-row items-center justify-between">
          <span className="text-sm text-gray-700 mr-6">
            Sort :
            <span className="text-black-100 ml-1 relative">
              <Menu
                arrow={true}
                className={"top-0"}
                menuButton={<button type="button">{sortByText}</button>}
              >
                {sortByText !== "Default Sorting" ? (
                  <MenuItem
                    onClick={() => {
                      setSortBy("");
                      setSortByText("Default Sorting");
                    }}
                  >
                    Default Sorting
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={() => {
                    setSortBy("desc");
                    setSortByText("Highest Price");
                  }}
                >
                  Highest Price
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSortBy("asc");
                    setSortByText("Lowest Price");
                  }}
                >
                  Lowest Price
                </MenuItem>
              </Menu>
            </span>
          </span>
          <span className="text-sm text-gray-700 ">
            Show:
            <span className="text-black-100 ml-1 relative">
              <Menu
                className={"top-0"}
                arrow={true}
                align="center"
                top="0px"
                menuButton={<button type="button">{perPage} Items</button>}
              >
                <MenuItem onClick={() => setPerPage(20)}>20 Items</MenuItem>
                <MenuItem onClick={() => setPerPage(30)}>30 Items</MenuItem>
                <MenuItem onClick={() => setPerPage(50)}>50 Items</MenuItem>
              </Menu>
            </span>
          </span>
        </div>
        <FilterSection
          minDelivery={minDelivery}
          maxDelivery={maxDelivery}
          priceRangeBool={priceRangeBool}
          setBrands={setBrands}
          setPriceRangeBool={setPriceRangeBool}
          brands={brands}
          setPage={setPage}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          categories={categories}
          priceMin={priceMin}
          priceMax={priceMax}
          lengthMin={lengthMin}
          lengthMax={lengthMax}
          widthMin={widthMin}
          widthMax={widthMax}
          heightMin={heightMin}
          heightMax={heightMax}
          selectedReview={selectedReview}
          setSelectedReview={setSelectedReview}
          products={products}
          setSelectedDelivery={setSelectedDelivery}
          selectedDelivery={selectedDelivery}
          setSelectedMinPrice={setSelectedMinPrice}
          setSelectedMaxPrice={setSelectedMaxPrice}
        />
      </div>
      <Wrapper>
        <Breadcrumb items={breadcrumb} classes={"mt-7"} />
        {/* <RelatedSearch relatedSearch={relatedSearch} /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 xl:grid-cols-9 2xl:grid-cols-9 gap-4">
          {window?.innerWidth > 1040 && (
            <FilterSection
              minDelivery={minDelivery}
              maxDelivery={maxDelivery}
              priceRangeBool={priceRangeBool}
              setPriceRangeBool={setPriceRangeBool}
              brands={brands}
              setPage={setPage}
              setBrands={setBrands}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              categories={categories}
              priceMin={priceMin}
              priceMax={priceMax}
              lengthMin={lengthMin}
              lengthMax={lengthMax}
              widthMin={widthMin}
              widthMax={widthMax}
              heightMin={heightMin}
              heightMax={heightMax}
              selectedReview={selectedReview}
              setSelectedReview={setSelectedReview}
              products={products}
              setSelectedDelivery={setSelectedDelivery}
              selectedDelivery={selectedDelivery}
              setSelectedMinPrice={setSelectedMinPrice}
              setSelectedMaxPrice={setSelectedMaxPrice}
            />
          )}
          <div
            className={
              window?.innerWidth < 640
                ? "w-[100%]"
                : "sm:col-span-7 lg:col-span-9 xl:col-span-7 w-[96vw] sm:w-[100%]"
            }
          >
            <div className="flex flex-row items-center justify-between">
              <span className="text-sm text-gray-700">
                Showing all {paginationData.total ? paginationData.total : "0"}{" "}
                results
              </span>
              <div
                onClick={() => setOpenFilterPopup(true)}
                className="lg:hidden xl:hidden bg-[#E2E8F0] p-[10px] rounded"
              >
                <img src={process.env.PUBLIC_URL + "icons/FilterIcon.png"} />
              </div>
              <div className="hidden sm:flex items-center">
                <span className="flex items-center justify-center cursor-pointer text-sm text-gray-700 mr-6">
                  Sort:
                  <span className="flex items-center justify-center text-black-100 ml-1 relative">
                    <Menu
                      arrow={true}
                      className={"top-0"}
                      menuButton={
                        <div
                          className="flex items-center justify-center "
                          type="button"
                        >
                          <span>{sortByText} </span>
                          <img
                            className="ml-[5px] mt-[2px]"
                            src={
                              process.env.PUBLIC_URL + "icons/arrow-down.png"
                            }
                          />
                        </div>
                      }
                    >
                      {sortByText !== "Default Sorting" ? (
                        <MenuItem
                          onClick={() => {
                            setSortBy("");
                            setSortByText("Default Sorting");
                          }}
                        >
                          Default Sorting
                        </MenuItem>
                      ) : null}
                      <MenuItem
                        onClick={() => {
                          setSortBy("desc");
                          setSortByText("Highest Price");
                        }}
                      >
                        Highest Price
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setSortBy("asc");
                          setSortByText("Lowest Price");
                        }}
                      >
                        Lowest Price
                      </MenuItem>
                    </Menu>
                  </span>
                </span>
                <span className="flex align-center justify-center cursor-pointer text-sm text-gray-700 ">
                  Show:
                  <span className=" text-black-100 ml-1 relative">
                    <Menu
                      className={"top-0"}
                      arrow={true}
                      align="center"
                      top="0px"
                      menuButton={
                        <div
                          className="flex items-center justify-center "
                          type="button"
                        >
                          <span>{perPage} </span>
                          <img
                            className="ml-[5px] mt-[2px]"
                            src={
                              process.env.PUBLIC_URL + "icons/arrow-down.png"
                            }
                          />
                        </div>
                      }
                    >
                      <MenuItem onClick={() => setPerPage(20)}>
                        20 Items
                      </MenuItem>
                      <MenuItem onClick={() => setPerPage(30)}>
                        30 Items
                      </MenuItem>
                      <MenuItem onClick={() => setPerPage(50)}>
                        50 Items
                      </MenuItem>
                    </Menu>
                  </span>
                </span>
                <span className="text-sm text-gray-700 ml-[20px]">
                  <img
                    src={
                      process.env.PUBLIC_URL + "icons/productListingFilter.png"
                    }
                  />
                </span>
                <span className="text-sm text-gray-700 ml-[20px]">
                  <img
                    src={
                      process.env.PUBLIC_URL + "icons/ProductListingSort.png"
                    }
                  />
                </span>
                {/* <div className="flex flex-row items-center">
                                    <CiGrid41 className="bg-gray-300 cursor-pointer" size={26} />
                                    <GoTasklist className="ml-2 cursor-pointer" size={26} />
                                </div> */}
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#E2E8F0] my-[5px] sm:my-4"></div>

            {/* Product Display Here  */}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-2 sm:gap-4 mt-4 mb-10">
              {loader ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="col-span-1">
                    <Skeleton count={1} height="400px" />
                  </div>
                ))
              ) : (
                <React.Fragment>
                  {products && products.length > 0 ? (
                    products.map((product, index) => {
                      return (
                        <React.Fragment key={index}>
                          <ProductCard
                            classes="col-span-1 mt-1 w-[46vw] sm:w-[100%]"
                            key={index}
                            product={product}
                          />
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="col-span-full flex justify-center items-center h-[300px]">
                      <h1 className="text-lg font-semibold">
                        No Product Found
                      </h1>
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>

            {/* Related Searched  */}
            {!loader && products.length <= perPage ? (
              <Pagination
                page={page}
                paginationData={paginationData}
                setPage={setPage}
              />
            ) : null}

         
          </div>
        </div>
        <div className="mb-10">
          <div className="flex items-center justify-between mx-2 my-[10px] sm:my-8">
            <h2 className=" font-medium ml-[8px] sm:font-semibold text-[16px] sm:text-2xl text-black-100 ">
              Products you may also like
            </h2>
            {/* {window?.innerWidth > 600 && window?.innerWidth < 1024 && (
              <span className="text-gray-700 text-sm">Page 1 of 3</span>
            )}
            {window?.innerWidth > 1024 && (
              <span className="text-gray-700 text-sm">Page 1 of 5</span>
            )} */}
          </div>
          {window?.innerWidth > 640 && (
            <div className="slider-container">
              <Slider {...settings} className="arrow__wrapper">
                {products && products.length > 0
                  ? products.map((product, index) => (
                      <div className="px-2">
                        <ProductCard
                          classes="min-h-[600px] mx-2"
                          key={index}
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
              {false ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="col-span-1 mt-1 min-h-[400px]"
                  />
                ))
              ) : (
                <React.Fragment>
                  {products && products.length > 0
                    ? products?.map((product, index) =>
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
        <div className="mb-10 ">
          <div className="flex items-center justify-between mx-2 my-[10px] sm:my-8">
            <h2 className=" font-medium ml-[8px] sm:font-semibold text-[16px] sm:text-2xl text-black-100 ">
              Inspired by your browsing history
            </h2>
            {/* {window?.innerWidth > 600 && window?.innerWidth < 1024 && (
            //   <span className="text-gray-700 text-sm">Page 1 of 3</span>
            // )}
            // {window?.innerWidth > 1024 && (
            //   <span className="text-gray-700 text-sm">Page 1 of 5</span>
            )} */}
          </div>
          {window?.innerWidth > 640 && (
            <div className="slider-container">
              <Slider {...settings} className="arrow__wrapper">
                {products && products.length > 0
                  ? products.map((product, index) => (
                      <div className="px-2">
                        <ProductCard
                          classes="min-h-[600px] mx-2"
                          key={index}
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
              {false ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="col-span-1 mt-1 min-h-[400px]"
                  />
                ))
              ) : (
                <React.Fragment>
                  {products && products.length > 0
                    ? products.map((product, index) =>
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
      </Wrapper>
    </div>
  );
};

export default React.memo(ProductListing);
// Filter Title
const FilterTitle = ({ classes, title }) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  return (
    <h2
      className={`${classes} text-black-100 font-medium  sm:font-semibold text-[16px] sm:text-lg`}
    >
      {title}
    </h2>
  );
};

// Custom Checkbox Component
const CustomCheckbox = ({ title, quantity, id, onClick, checked }) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  return (
    <div className="flex items-center justify-between text-gray-700 mt-1">
      <div className="flex items-center">
        <input
          id={title.split("")[0] + id}
          type="checkbox"
          checked={checked} // Controlled checkbox
          onChange={onClick} // Use onChange instead of onClick
          className="outline-none w-4 h-4 border-primary rounded accent-primary"
        />
        <label htmlFor={title.split("")[0] + id} className="ml-2 text-sm">
          {title}
        </label>
      </div>
      <span>{quantity}</span>
    </div>
  );
};

// Custom Radio Component
const CustomRadio = ({ children, id, rating, quantity, onClick, checked }) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  return (
    <div className="flex items-center mb-2 ">
      <input
        type="radio"
        name={id}
        checked={checked}
        className="w-5 h-5  mr-2 accent-primary cursor-pointer"
        onChange={onClick}
      />
      <label
        htmlFor={id}
        className="w-full flex items-center justify-between text-gray-700 text-sm"
      >
        <div className="flex items-center">
          <Rating rating={rating} />
          <span className="">& Up </span>
        </div>
        <span>{quantity}</span>
      </label>
    </div>
  );
};

// Rating Component
const Rating = ({ rating, classes }) => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  const [criteria, setCriteria] = useState(rating);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let rate = Math.round(Number(rating));
    setCriteria(rate);
  }, [rating]);
  return (
    <div className={`flex flex-row items-center ${classes}`}>
      {Array.from({ length: 5 }, (_, i) => {
        return (
          <span key={i} className="mr-1">
            {criteria > i ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.00779 2.00915L9.03434 4.07923C9.17434 4.36739 9.54761 4.64379 9.86261 4.69672L11.7232 5.0084C12.9131 5.20836 13.1931 6.07873 12.3357 6.93734L10.8892 8.39579C10.6442 8.64277 10.5101 9.11912 10.5858 9.46026L11 11.2657C11.3266 12.6947 10.5742 13.2475 9.32017 12.5006L7.57618 11.4598C7.26124 11.2716 6.74213 11.2716 6.4213 11.4598L4.67734 12.5006C3.42914 13.2475 2.6709 12.6888 2.99753 11.2657L3.41165 9.46026C3.48747 9.11912 3.35332 8.64277 3.10835 8.39579L1.66184 6.93734C0.81027 6.07873 1.08441 5.20836 2.27427 5.0084L4.1349 4.69672C4.44403 4.64379 4.81733 4.36739 4.95731 4.07923L5.98385 2.00915C6.5438 0.885905 7.45368 0.885905 8.00779 2.00915Z"
                  fill="#64748B"
                  stroke="#64748B"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.00779 2.00915L9.03434 4.07923C9.17434 4.36739 9.54761 4.64379 9.86261 4.69672L11.7232 5.0084C12.9131 5.20836 13.1931 6.07873 12.3357 6.93734L10.8892 8.39579C10.6442 8.64277 10.5101 9.11912 10.5858 9.46026L11 11.2657C11.3266 12.6947 10.5742 13.2475 9.32017 12.5006L7.57618 11.4598C7.26124 11.2716 6.74213 11.2716 6.4213 11.4598L4.67734 12.5006C3.42914 13.2475 2.6709 12.6888 2.99753 11.2657L3.41165 9.46026C3.48747 9.11912 3.35332 8.64277 3.10835 8.39579L1.66184 6.93734C0.81027 6.07873 1.08441 5.20836 2.27427 5.0084L4.1349 4.69672C4.44403 4.64379 4.81733 4.36739 4.95731 4.07923L5.98385 2.00915C6.5438 0.885905 7.45368 0.885905 8.00779 2.00915Z"
                  fill="#fff"
                  stroke="#64748B"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
};

// Filter Section
const FilterSection = ({
  brands,
  setBrands,
  priceMin,
  selectedBrands,
  priceMax,
  setSelectedReview,
  selectedReview,
  setSelectedBrands,
  products,
  setPage,
  minDelivery,
  selectedMaxPrice,
  selectedMinPrice,
  maxDelivery,
  setSelectedDelivery,
  selectedDelivery,
  setSelectedMinPrice,
  setSelectedMaxPrice,
}) => {
  const [seeMoreBrand, setSeeMoreBrand] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  const navigate = useNavigate();
  let count = 6;
  const breadcrumb = [
    {
      url: "#",
      title: "Home",
    },
    {
      url: "#",
      title: "Shop",
    },
    {
      title: "Search results for “microwave”",
    },
  ];
  const [minValue, set_minValue] = useState(priceMin);
  const [maxValue, set_maxValue] = useState(priceMax);

  const [handleBtnState, setHandleBtnState] = useState({
    appliedSearch: false,
    price: false,
    brand: false,
    review: false,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(1);
  }, []);
  const numberOfRanges = 5;
  // let timeoutId; // Keep track of the timeout ID

  const handleInput = (e) => {
    const minValue = e.minValue;
    const maxValue = e.maxValue;
    set_minValue(minValue);
    set_maxValue(maxValue);
  };

  const handleCheckboxChange = (brandId) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSelectedBrands((prev) => {
      const updatedBrands = {
        ...prev,
        [brandId]: !prev[brandId], // Toggle checked state
      };

      // Update handleBtnState based on whether any brand is selected
      setHandleBtnState((prevState) => ({
        ...prevState,
        brand: Object.values(updatedBrands).some((isSelected) => isSelected),
      }));

      return updatedBrands;
    });
  };

  const handlerPriceRange = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSelectedMinPrice(minValue);
    setSelectedMaxPrice(maxValue);
    setHandleBtnState((prevState) => {
      if (minValue == 10 && maxValue == 20000) {
        return {
          ...prevState, // Spread the previous state to retain other properties
          price: false, // Update the `price` property to false
        };
      } else {
        return {
          ...prevState, // Spread the previous state to retain other properties
          price: true, // Update the `price` property to true
        };
      }
    });
  };
  return (
    <React.Fragment>
      <div className="col-span-2 h-[100vh] overflow-auto px-3">
        {/* Price Section  */}
        <React.Fragment>
          {location.search && location.search !== "?search=" ? (
            <React.Fragment>
              <div className="flex items-center justify-between">
                <FilterTitle title="Applied Search" />
                <button
                  className={`underline cursor-pointer ${
                    handleBtnState?.appliedSearch == true
                      ? "text-[black]"
                      : "text-[black]"
                  } font-semibold text-sm`}
                  onClick={() => navigate("/products?search=")}
                >
                  Clear All
                </button>
              </div>

              <div className="mt-5 mb-5">
                <span className="inline-flex items-center bg-gray-200 text-black-100 text-sm px-3 py-2 rounded-sm">
                  {location.search ? searchQuery : ""}{" "}
                  <IoClose
                    className="ml-2 cursor-pointer "
                    onClick={() => navigate("/products?search=")}
                  />
                </span>
              </div>
              <div className="h-[1px] w-full bg-gray-300 my-3 "></div>
            </React.Fragment>
          ) : null}
        </React.Fragment>
        <React.Fragment>
          <div className="flex items-center justify-between">
            <FilterTitle title="Price" />
            <button
              className={`underline cursor-pointer ${
                handleBtnState?.price === true ? "text-[black]" : "text-[gray]"
              } font-semibold text-sm`}
              onClick={
                handleBtnState?.price
                  ? () => {
                      set_minValue(10);
                      set_maxValue(20000);
                      setSelectedMaxPrice(20000);
                      setSelectedMinPrice(10);
                      setHandleBtnState((prevState) => ({
                        ...prevState, // Spread the previous state to retain other properties
                        price: false, // Update the `appliedSearch` property to true
                      }));
                    }
                  : null
              }
            >
              Clear All
            </button>
          </div>
          <span className="text-gray-700 text-sm text-center block my-1">
            ${minValue} - ${maxValue}+
          </span>
          <MultiRangeSlider
            min={10}
            max={20000}
            step={10}
            minValue={minValue}
            maxValue={maxValue}
            ruler={false}
            style={{ border: "none", boxShadow: "none", padding: "3px 0" }}
            className="border-none"
            thumbLeftColor="#186737"
            label="false"
            thumbRightColor="#186737"
            onInput={(e) => {
              handleInput(e);
            }}
            onChange={() => handlerPriceRange()}
          />
          <p className="flex items-center justify-between text-gray-700 text-sm mt-1">
            <span>${priceMin}</span>
            <span>${(Math.floor(priceMin) + Math.floor(priceMax)) / 2}</span>
            <span>${priceMax}</span>
          </p>

          <div className="h-[1px] w-full bg-gray-300 my-3 "></div>
        </React.Fragment>
        <React.Fragment>
          <div className="flex items-center justify-between">
            <FilterTitle title={"Brand"} />
            <button
              className={`${
                handleBtnState?.brand == true ? "text-[black]" : "text-[gray]"
              } font-semibold text-sm underline cursor-pointer`}
              onClick={() => {
                if (handleBtnState?.brand) {
                  setBrands([]);
                  setSelectedBrands({});
                  setHandleBtnState((prevState) => ({
                    ...prevState, // Spread the previous state to retain other properties
                    brand: false, // Update the `brand` property to false
                  }));
                }
              }}
            >
              Clear All
            </button>
          </div>
          <div className="relative mt-1">
            <div className="mt-3">
              {brands ? (
                brands
                  .slice(0, seeMoreBrand ? brands.length : 5)
                  .map((brand, index) => (
                    <React.Fragment key={index}>
                      <CustomCheckbox
                        id={brand.id}
                        title={brand.name}
                        checked={!!selectedBrands[brand.id]}
                        onClick={() => {
                          handleCheckboxChange(brand.id);
                          if (seeMoreBrand) {
                            if (brands.length == 0) {
                              setHandleBtnState((prevState) => ({
                                ...prevState,
                                brand: false,
                              }));
                            } else {
                              setHandleBtnState((prevState) => ({
                                ...prevState,
                                brand: true,
                              }));
                            }
                          }
                        }}
                      />
                    </React.Fragment>
                  ))
              ) : (
                <p>No Brand Found</p>
              )}

              <p
                className="underline text-gray-700 text-xs mt-2 cursor-pointer"
                onClick={() => setSeeMoreBrand(!seeMoreBrand)}
              >
                {!seeMoreBrand ? "See More" : "See Less"}
              </p>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#E2E8F0] my-5"></div>
        </React.Fragment>

        <React.Fragment>
          <div className="flex items-center justify-between">
            <FilterTitle title={"Reviews"} />
            <button
              disabled={handleBtnState?.review == true ? false : true}
              className={`${
                handleBtnState?.review === true ? "text-[black]" : "text-[gray]"
              } font-semibold text-sm underline cursor-pointer`}
              onClick={() => {
                setSelectedReview();
                setHandleBtnState((prevState) => ({
                  ...prevState, // Spread the previous state to retain other properties
                  review: false, // Update the `appliedSearch` property to true
                }));
              }}
            >
              Clear All
            </button>
          </div>
          <div className="mt-3">
            <CustomRadio
              id={"ratting"}
              rating={5}
              checked={selectedReview === 5}
              onClick={() => {
                setSelectedReview(5);
                setHandleBtnState((prevState) => ({
                  ...prevState, // Spread the previous state to retain other properties
                  review: true, // Update the `appliedSearch` property to true
                }));
              }}
            />
            <CustomRadio
              id={"ratting"}
              rating={4}
              checked={selectedReview === 4}
              onClick={() => {
                setSelectedReview(4);
                setHandleBtnState((prevState) => ({
                  ...prevState, // Spread the previous state to retain other properties
                  review: true, // Update the `appliedSearch` property to true
                }));
              }}
            />
            <CustomRadio
              id={"ratting"}
              rating={3}
              checked={selectedReview === 3}
              onClick={() => {
                setSelectedReview(3);
                setHandleBtnState((prevState) => ({
                  ...prevState, // Spread the previous state to retain other properties
                  review: true, // Update the `appliedSearch` property to true
                }));
              }}
            />
            <CustomRadio
              id={"ratting"}
              rating={2}
              checked={selectedReview === 2}
              onClick={() => {
                setSelectedReview(2);
                setHandleBtnState((prevState) => ({
                  ...prevState, // Spread the previous state to retain other properties
                  review: true, // Update the `appliedSearch` property to true
                }));
              }}
            />
            <CustomRadio
              id={"ratting"}
              rating={1}
              checked={selectedReview === 1}
              onClick={() => {
                setSelectedReview(1);
                setHandleBtnState((prevState) => ({
                  ...prevState, // Spread the previous state to retain other properties
                  review: true, // Update the `appliedSearch` property to true
                }));
              }}
            />
          </div>
        </React.Fragment>
      </div>
    </React.Fragment>
  );
};
