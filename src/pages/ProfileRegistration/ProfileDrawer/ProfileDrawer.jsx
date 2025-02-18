import React from "react";
import { Wrapper } from "../../../shared/Wrapper";
import { useNavigate } from "react-router";

const ProfileDrawer = ({ setShowProfileDrawer }) => {
  const handlerSignOut = () => {
    localStorage.clear();
    navigate("/home");
  };
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userProfile"));
  const navItems = [
    {
      id: "",
      name: "Browsing History",
      link: "/registration/browsing-history",
      icon: `${process.env.PUBLIC_URL}/profileIcons/Frame-1.png`,
    },
    {
      id: "",
      name: "Return/Refund",
      link: "/registration/return-orders",
      icon: `${process.env.PUBLIC_URL}/profileIcons/returnIcon.png`,
    },
    {
      id: "",
      name: "Your Reviews",
      link: "/registration/reviews",
      icon: `${process.env.PUBLIC_URL}/profileIcons/Frame-2.png`,
    },

    {
      id: "",
      name: "Addresses",
      link: "/registration/addresses",
      icon: `${process.env.PUBLIC_URL}/profileIcons/Frame-7.png`,
    },

    {
      id: "",
      name: "Account Security",
      link: "/registration/AccountSecurity",
      icon: `${process.env.PUBLIC_URL}/profileIcons/Frame-10.png`,
    },
    {
      id: "",
      name: "Sign Out",
      link: "/",
      icon: `${process.env.PUBLIC_URL}/profileIcons/signOut.png`,
    },
  ];
  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          setShowProfileDrawer(false);
        }}
        className="w-[100vw] mt-[-140px] flex justify-center h-[72vh]"
      >
        <div
          style={{ zIndex: "999" }}
          className="absolute z-999 w-[95%] mx-[auto] mt-[90px] rounded-md border-2 p-5 mt-[-50px] z-999 bg-[white]"
        >
          <div className="h-[170px] p-4  rounded-md bg-[#DEF9EC] ">
            <h1 className="text-[18px] font-medium leading-[24px] text-center">
              Hello, {userData?.name}
            </h1>
            <p className="text-[12px] mt-[5px] font-light leading-[24px] text-center">
              {userData?.email}
            </p>
            <div className="flex items-center justify-between mt-[10px]">
              <div
                onClick={() => {
                  navigate("/registration/all-orders");
                  setShowProfileDrawer(false);
                }}
                className="flex flex-col items-center justify-center"
              >
                <img
                  className="p-[10px] bg-[#186737] h-[44px] w-[44px] rounded-full"
                  src={`${process.env.PUBLIC_URL}/profileIcons/Drawer-1.png`}
                />
                <p className="text-center text-[12px] font-normal leading-[14.08px] mt-[10px]">
                  Your Orders
                </p>
              </div>
              <div
                onClick={() => {
                  navigate("/registration/coupons-offers");
                  setShowProfileDrawer(false);
                }}
                className="flex flex-col items-center justify-center"
              >
                <img
                  className="p-[10px] bg-[#186737] h-[44px] w-[44px] rounded-full"
                  src={`${process.env.PUBLIC_URL}/profileIcons/Drawer-2.png`}
                />
                <p className="text-center text-[12px] font-normal leading-[14.08px] mt-[10px]">
                  Coupons & Offers
                </p>
              </div>
              <div
                onClick={() => {
                  navigate("/registration/wishlist");
                  setShowProfileDrawer(false);
                }}
                className="flex flex-col items-center justify-center"
              >
                <img
                  className="p-[10px] bg-[#186737] h-[44px] w-[44px] rounded-full"
                  src={`${process.env.PUBLIC_URL}/profileIcons/Drawer-3.png`}
                />
                <p className="text-center text-[12px] font-normal leading-[14.08px] mt-[10px]">
                  Wishlist
                </p>
              </div>
            </div>
          </div>
          {navItems?.map((item) => {
            return (
              <div
                onClick={() => {
                  if (item.name === "Sign Out") {
                    handlerSignOut();
                  } else {
                    navigate(item.link);
                  }
                  setShowProfileDrawer(false);
                }}
                className="flex items-center py-[15px] border-b-2"
              >
                <img className="mr-[10px]" src={item.icon} />
                <p>{item?.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
