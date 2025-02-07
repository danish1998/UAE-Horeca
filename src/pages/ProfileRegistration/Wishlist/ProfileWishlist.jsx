import React, { useEffect, useState, lazy } from "react";
import { Wrapper } from "../../../shared/Wrapper";
import SidebarProfile from "../../../components/SidebarProfile";
import WishlistBox from "./Components/WishlistBox";
import { apiClient } from "../../../utils/apiWrapper";
import Skeleton from "react-loading-skeleton";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import { useNavigate } from "react-router";
import CommonProducts from "../CommonProducts/CommonProducts";
import { toast } from "react-toastify";
import { useWishlist } from "../../../context/WishListContext";
import { useLocalCartCount } from "../../../context/LocalCartCount";
import { useCart } from "../../../context/CartContext";

const ProfileWishlist = () => {
  const { incrementCartItems, incrementWishListItems } = useLocalCartCount();
  const { totalWishListCount, triggerUpdateWishList } = useWishlist();
  const { triggerUpdateCart } = useCart();
  const [wishListData, setWishListData] = useState([]);
  const [updateCommonProduct, setUpdateCommonProduct] = useState(false);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const fetchAllReviews = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
    }
    try {
      const response = await apiClient.get("/wishlist");
      setWishListData(response?.data?.wishlist);
      setLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      return;
    }
  };

  const handleRemoveWhenAddToCart = async (product) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        setLoader(true);
        const response = await apiClient.delete(`/wishlist/remove`, {
          params: { product_id: product.id },
        });
        incrementWishListItems(-1);
        triggerUpdateWishList();
      } catch (error) {
        console.error("Error:", error);
      } finally {
        return;
      }
    }
  };

  const handlerRemoveWishlist = async (product) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        setLoader(true);
        const response = await apiClient.delete(`/wishlist/remove`, {
          params: { product_id: product.id },
        });

        setLoader(false);
        toast(
          <span className="line-clamp-4">{`Successfully Removed from Wishlist`}</span>
        );
        incrementWishListItems(-1);
        triggerUpdateWishList();
        setUpdateCommonProduct(!updateCommonProduct);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        return;
      }
    }
  };

  const handleAddToCart = async (product) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        setLoader(true);
        const response = await apiClient.post(`/cart`, {
          product_id: product.id,
          quantity: 1,
        });
        handleRemoveWhenAddToCart(product);
        setUpdateCommonProduct(!updateCommonProduct)
        toast(
          <span className="line-clamp-4">{`Successfully Added to Cart`}</span>
        );
        setLoader(false);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoader(false);
      }
    }
  };



  useEffect(() => {
    fetchAllReviews();
  }, []);
  useEffect(()=>{
    fetchAllReviews();
    triggerUpdateCart();
  },[triggerUpdateWishList]);

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
      title: "Wishlist",
    },
  ];
  return (
    <>
      <Wrapper>
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-4 mb-2"} />
      </Wrapper>
      <Wrapper>
        <div className="flex">
          <SidebarProfile />
          {/* WishList Section */}
          <div className="flex flex-col p-[10px] justify-between w-[100%] h-[100%]">
            {window?.innerWidth > 640 && (
              <p className=" font-light font-sans text-[18px] font-normal leading-[24px] text-left decoration-slice">
                My Wishlist
              </p>
            )}
            {window?.innerWidth < 640 && (
              <p className=" font-light font-sans text-[18px] mt-[5px] font-normal leading-[24px] text-center decoration-slice">
                Wishlist
              </p>
            )}
            <div>
              {loader ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="col-span-1">
                    <Skeleton count={1} height="250px" />
                  </div>
                ))
              ) : (
                <React.Fragment>
                  {wishListData && wishListData.length > 0 ? (
                    <>
                      {" "}
                      {wishListData?.map((item) => {
                        return (
                          <WishlistBox
                            handlerRemoveWishlist={handlerRemoveWishlist}
                            data={item.product ? item.product : item}
                            handleAddToCart={handleAddToCart}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div className="col-span-full flex justify-center items-center h-[300px]">
                        <h1 className="text-lg font-semibold">
                          No Items Available
                        </h1>
                      </div>
                    </>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <CommonProducts updateCommonProduct={updateCommonProduct}/>
      </Wrapper>
    </>
  );
};

export default ProfileWishlist;
