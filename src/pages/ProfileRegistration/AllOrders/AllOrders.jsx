import React, { useEffect, useState, useCallback } from "react";
import AllOrdersBox from "./components/AllOrdersBox";
import { Wrapper } from "../../../shared/Wrapper";
import SidebarProfile from "../../../components/SidebarProfile";
import { apiClient } from "../../../utils/apiWrapper";
import Skeleton from "react-loading-skeleton";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import ImagePopup from "../../../components/ImagePopup";
import { useNavigate } from "react-router";
import CommonProducts from "../CommonProducts/CommonProducts";
import { CiSearch } from "react-icons/ci";
import { debounce } from "lodash";
const AllOrders = () => {
  const [viewedLoader, setViewedLoader] = useState(true);
  const [ordersData, setOrdersData] = useState([]);
  const [filterOrdersData, setFilterOrdersData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [imageView, setImageView] = useState("");
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("All Orders");
  const tabs = ["All Orders", "Pending", "Processing", "Completed", "Returned", "Cancelled"];
  const navigate = useNavigate();
  const navigation = (data) => {
    navigate("/order-details", data);
  };

  const fetchAllOrders = async (keys) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
    }
    try {
      let url;
      if (keys) {
        url = `/orders?search=${keys}`;
      } else {
        url = `/orders`;
      }
      const response = await apiClient.get(url);
      setOrdersData(response?.data.data);
      setViewedLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setViewedLoader(false);
    }
  };

  // const fetchProducts = async () => {
  //   const authToken = localStorage.getItem("authToken");
  //   const response = await apiClient.get(
  //     `${authToken ? "/products" : "/products-guest"}`
  //   );
  //   setProducts(response.data.data.data);
  // };

  useEffect(() => {
    // fetchProducts();
    fetchAllOrders();

  }, []);
  const debouncedFetch = useCallback(
    debounce((searchKeys) => {
      fetchAllOrders(searchKeys);
    }, 300), // Adjust debounce time as needed
    []
  );

  const handleSearch = async (e) => {
    const value = e.target.value;

    debouncedFetch(value);
  }

  const handleTabs = (tab) => {
    setActiveTab(tab); // Trigger state update
  };

  useEffect(() => {
    // React to activeTab changes
    if (activeTab === "All Orders") {
      setFilterOrdersData(ordersData);
    } else {
      const filterData = ordersData.filter((item) => item.status.label === activeTab);
      setFilterOrdersData(filterData);
    }
  }, [activeTab, ordersData]);

  const collectionBreadCrumb = [
    {
      url: "/",
      title: "Your Account",
    },
    {
      url: "/",
      title: "Profile",
    },
    {
      title: "Your Orders",
    },
  ];



  return (
    <>
      <Wrapper>
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-4 mb-2"} />
      </Wrapper>
      <div className="block sm:hidden">
        <h1 className="border-bottom-2 text-center mt-[25px]">Your Orders</h1>
        <div className="flex py-[10px] justify-between w-[100%]">
          <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-wrap w-full sm:w-[45%] p-[10px] mb-[10px] border-b border-gray-300 justify-between gap-4 mt-[0px] min-w-max">
            {tabs.map((tab) => (
              <p
                key={tab}
                onClick={() => handleTabs(tab)}
                className={`font-work-sans text-base font-normal leading-6 text-left cursor-pointer relative ${activeTab === tab
                  ? "text-[#186737] after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-[50%] after:h-[2px] after:bg-[#186737] after:rounded-full"
                  : "text-[#666666]"
                  }`}
              >
                {tab}
              </p>
            ))}
          </div>
          </div>
        </div>

        <div className="block sm:hidden w-full">
          <div className="flex items-center w-[90%] ml-[24px] border rounded-[20px] border-2">
            <input
              onChange={handleSearch}
              className="flex-1 p-[10px] rounded-l-[20px] focus:outline-none"
              type="text"
              placeholder="Order No."
            />
            <button
              className="bg-white px-4 py-1 rounded-r-[20px] flex items-center justify-center"
            >
              <CiSearch color="black" size={24} />
            </button>
          </div>
        </div>
      </div>
      <Wrapper>
        <div className="hidden sm:flex">
          <div className="hidden sm:flex">
            <SidebarProfile />
          </div>
          <div className="flex flex-col  w-[100%]">
            {/* Sub-Navbar */}
            <h1 className="block sm:hidden text-center mt-[15px]">
              Your Orders
            </h1>
            <div className="grid grid-cols-12 gap-4 p-4 w-full">
              {/* Left Side: Tabs */}
                     
              <div className="md:col-span-6 lg:col-span-8 xl:col-span-8 2xl:col-span-8 col-span-6 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-[5px] ">
                {tabs.map((tab, index) => (
                  <p
                    key={tab}
                    onClick={() => handleTabs(tab)}
                    className={`font-work-sans text-base font-normal leading-6 text-left cursor-pointer relative ${activeTab === tab
                      ? "text-[#186737] after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:w-[50%] after:h-[2px] after:bg-[#186737] after:rounded-full"
                      : "text-[#666666]"
                      }`}
                  >
                    {tab}
                  </p>
                ))}
              </div>
              
              {/* Right Side: Input */}
              <div className="md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-4 col-span-6 w-full mx-auto">
                <div className="flex items-center border rounded-[20px] border-2 w-full">
                  <input
                    onChange={handleSearch}
                    className="flex-1 p-[5px] rounded-l-[20px] focus:outline-none"
                    type="text"
                    placeholder="Order No. Ex: #10000650"
                  />
                  <button
                    className="bg-white px-4 py-1 rounded-r-[20px] flex items-center justify-center"
                  >
                    <CiSearch color="black" size={24} />
                  </button>
                </div>
              </div>
            </div>


            {viewedLoader ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="col-span-1 mt-1 min-h-[180px]"
                />
              ))
            ) : (
              <React.Fragment>

                {filterOrdersData && filterOrdersData.length > 0 ? (
                  filterOrdersData?.map((item, index) => {
                    return (
                      <AllOrdersBox
                        key={item.id}
                        data={item}
                        id={index}
                        setImageView={setImageView}
                        setShowPopup={setShowPopup}
                        navigation={navigation}
                      />
                    );
                  })
                ) : filterOrdersData && filterOrdersData.length > 0 ? (
                  filterOrdersData?.map((item, index) => {
                    return (
                      <AllOrdersBox
                        key={item.id}
                        data={item}
                        id={index}
                        setImageView={setImageView}
                        setShowPopup={setShowPopup}
                        navigation={navigation}
                      />
                    );
                  })
                ) :
                  (
                    <div className="flex items-center justify-center">
                      <p className="col-span-5 font-semibold text-center text-base">
                        No Product Found
                      </p>
                    </div>
                  )}
              </React.Fragment>
            )}
          </div>
          {showPopup && (
            <ImagePopup setShowPopup={setShowPopup} imageView={imageView} />
          )}
        </div>

        <div className="block sm:hidden mt-4" >

          {viewedLoader ? (
            Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className="col-span-1 mt-1 min-h-[180px]"
              />
            ))
          ) : (
            <React.Fragment>

              {filterOrdersData && filterOrdersData.length > 0 ? (
                filterOrdersData?.map((item, index) => {
                  return (
                    <AllOrdersBox
                      key={item.id}
                      data={item}
                      id={index}
                      setImageView={setImageView}
                      setShowPopup={setShowPopup}
                      navigation={navigation}
                    />
                  );
                })
              ) : filterOrdersData && filterOrdersData.length > 0 ? (
                filterOrdersData?.map((item, index) => {
                  return (
                    <AllOrdersBox
                      key={item.id}
                      data={item}
                      id={index}
                      setImageView={setImageView}
                      setShowPopup={setShowPopup}
                      navigation={navigation}
                    />
                  );
                })
              ) :



                (
                  <div className="flex items-center justify-center">
                    <p className="col-span-5 font-semibold text-center text-base">
                      No Product Found
                    </p>
                  </div>
                )}
            </React.Fragment>
          )}
        </div>
        <CommonProducts />
      </Wrapper>
    </>
  );
};

export default AllOrders;
