import React, { useEffect, useState } from "react";
import { Wrapper } from "../../../shared/Wrapper";
import SidebarProfile from "../../../components/SidebarProfile";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import Popup from "./Components/Popup";
import Skeleton from "react-loading-skeleton";
import { apiClient } from "../../../utils/apiWrapper";
import { notify } from "../../../utils/notify";
import CommonProducts from "../CommonProducts/CommonProducts";
import { findDefaultAddress } from "../../../utils/functions";
import { FullScreenLoader } from "../../../shared/Loader";
const Addresses = () => {
  const [popupHeading, setPopupHeading] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [getData, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addressloader, setUpdateLoader] = useState(false);
  const [updateStatus, setStatus] = useState(false);
  const [items, setItems] = useState("");
  const authToken = localStorage.getItem("authToken");

  const fetchProducts = async () => {
    const response = await apiClient.get(
      `${authToken ? "/products" : "/products-guest"}`
    );
    setProducts(response.data.data.data);
  };

  
  const fetchDefaultAddress = async () => {
    setUpdateLoader(true);
  try {
    const response = await apiClient.get(`/addresses`);
    const defaultAdd = findDefaultAddress(response.data.data);
    localStorage.setItem('defaultAddress',JSON.stringify(defaultAdd));
    setData(response.data);
    setUpdateLoader(false);
  } catch (error) {
    console.log("error", error);
  } finally {
    setUpdateLoader(false);
  }
};


  const fetchAddress = async () => {
 
      setLoader(true);
    
   
    try {
      const response = await apiClient.get(`/addresses`);
      const defaultAdd = findDefaultAddress(response.data.data);
      localStorage.setItem('defaultAddress',JSON.stringify(defaultAdd));
      setData(response.data);
      setLoader(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoader(false);
    }
  };

  

  const deleteAddress = async (id) => {
    setLoader(true);
    try {
      const response = await apiClient.delete(`/addresses/${id}`);
      setStatus(!updateStatus);
      notify("", "Address Removed Successfully");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoader(false);
    }
  };

  const defaultAddress = async (id) => {
    setUpdateLoader(true);
    try {
      const response = await apiClient.post(
        `/addresses/update-default-address`,
        {
          address_id: id,
        }
      );
      fetchDefaultAddress()
      notify("", response.data.message);
  
    } catch (error) {
      console.log("error", error);
    } finally {
     
    }
  };

  const updateAddress = (items) => {
 
    setItems(items);
    setShowPopup(true);
    setPopupHeading("Update Address");
  };

  const AddAddress = () => {
    setItems(null);
    setShowPopup(true);
    setPopupHeading("Add New Address");
  };

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
      title: "Addresses",
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchAddress();
  }, []);

  useEffect(() => {
    fetchAddress();
  }, [updateStatus]);

 

  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showPopup]);
 
  return (
    <>
    
      <Wrapper>
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-4 mb-2"} />
      </Wrapper>
      <Wrapper>
        {addressloader?<FullScreenLoader/>:''}
        <div className="grid grid-cols-1 lg:grid-cols-4 ">
          <SidebarProfile />
          {loader ? (
            <Skeleton count={1} height="250px" width={"70vw"} />
          ) : (
            <div className="flex flex-col p-[10px] w-full col-span-3">
              <p className="font-light font-sans text-[18px] lg:text-left md:text-left xl:text-left 2xl:text-left text-center   leading-[24px]">
                Your Addresses
              </p>
              <p className="font-light font-sans text-[#0A8800] text-[12px] lg:text-left md:text-left xl:text-left 2xl:text-left text-center leading-[24px] flex items-center">
                <img
                  src={`${process.env.PUBLIC_URL}/icons/lock.png`}
                  alt="lock"
                  className="inline-block mr-1"
                />
                All data is encrypted
                <img
                  src={`${process.env.PUBLIC_URL}/icons/righ-arrow.png`}
                  alt="arrow"
                  className="inline-block ml-1"
                />
              </p>
              {/* Address List */}
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 capitalize">
                {!!getData &&
                  getData?.data?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row rounded-none sm:rounded-md border-2 w-full mt-[10px]"
                    >
                      <div className="p-[15px] w-full">
                        <div className="flex sm:flex-col items-center sm:items-start">
                          <p className="font-sans p-[px] text-lg font-medium text-left">
                            {item.name}
                          </p>
                          <p className="font-sans p-[2px] text-[#64748B] text-base text-left">
                            {item.phone}
                          </p>
                        </div>
                        <p className="font-sans p-[2px] sm:border-b border-none   text-[#64748B] text-base text-left">
                          {item.address}, {item.zip_code}, {item.state},{" "}
                          {item.country}
                        </p>
                        <div className="flex items-center mt-[10px]">
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                checked={item.is_default}
                                onClick={() => defaultAddress(item.id)}
                              />
                              <p className="font-sans text-[#64748B] p-[5px] ml-[5px] text-sm">
                                Default
                              </p>
                            </div>
                            <div className="flex text-[14px] text-[#64748B] sm:hidden">
                              <p
                                className="px-[10px] border-r cursor-pointer"
                                onClick={() => deleteAddress(item.id)}
                              >
                                Delete
                              </p>
                              <p
                                onClick={() => updateAddress(item)}
                                className="px-[10px] border-r cursor-pointer"
                              >
                                Edit
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-center p-[15px]">
                        <button
                            onClick={() => updateAddress(item)}
                          className="flex m-[10px] items-center justify-center rounded-md w-[180px] h-[40px] border border-[#666666] text-[16px] text-[#666666] font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(item.id)}
                          className="flex m-[10px] items-center justify-center rounded-md w-[180px] h-[40px] border border-[#666666] text-[16px] text-[#666666] font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Add New Address Button */}
              <div>
                <h1
                  className="mt-[20px] font-work-sans text-[16px] text-[#186737] cursor-pointer"
                  onClick={AddAddress}
                >
                  Add New Address
                </h1>
              </div>
            </div>
          )}
        </div>
        <CommonProducts />
        {/* Popup Component */}
        {showPopup && (
          <Popup
            setShowPopup={setShowPopup}
            popupHeading={popupHeading}
            items={items}
            updateStatus={updateStatus}
            setStatus={setStatus}
          />
        )}
      </Wrapper>
    </>
  );
};

export default Addresses;
