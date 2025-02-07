import React, { useEffect, useState } from "react";
import { Wrapper } from "../../../shared/Wrapper";
import SidebarProfile from "../../../components/SidebarProfile";
import ReviewCard from "./Components/ReviewCard";
import { apiClient } from "../../../utils/apiWrapper";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import { notify } from "../../../utils/notify";
import ReviewPopup from "../../../components/ReviewPopup";
import CommonProducts from "../CommonProducts/CommonProducts";

const Reviews = () => {
  const [loader, setLoader] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviewId, setReviewId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [updateReviews, setUpdateReviews] = useState(false);
  const [selectedReviewedData,setSelectedReviewedData]=useState();

  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const fetchAllReviews = async () => {

    if (!authToken) {
      navigate("/login");
    }
    try {
      setLoader(true);
      const response = await apiClient.get("/customer-reviews");
      setReviewData(response?.data);
      setLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const fetchProducts = async () => {
    const response = await apiClient.get(
      `${authToken ? "/products" : "/products-guest"}`
    );
    setProducts(response.data.data.data);
  };

  const deleteReview = async (id) => {
    try {
      const response = await apiClient.delete(`customer-reviews-delete/${id}`);

      notify("", response.data.message);
      if (response.status == 200) {
        setReviewData((prevReviews) => prevReviews.filter((review) => review.id !== id));
        fetchAllReviews(); 
        setShowPopup(false);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const updateReview = (data) => {
    setSelectedReviewedData(data);
    setReviewId(data.id);
    setProductId(data.product_id);
    setShowPopup(true);
  };

  useEffect(() => {
    fetchProducts();
    fetchAllReviews();
  }, []);

 
 useEffect(()=>{
  fetchAllReviews();
 },[updateReviews]);
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
      title: "Your Reviews",
    },
  ];


  return (
    <>
      <Wrapper>
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-4 mb-2"} />
      </Wrapper>
      <h1 className="block sm:hidden text-center border-b-2 p-2">My Reviews</h1>
      <Wrapper>
        <div className="flex">
          <SidebarProfile />
          {/* Reviews Section */}
          <div className="flex flex-col p-[10px] justify-between w-[100%] h-[100%]">
            <h1 className="hidden sm:block">My Reviews</h1>
            <div>
              {/*  */}
              {loader ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="col-span-1" >
                    <Skeleton count={1} height="250px" />
                  </div>
                ))
              ) : (
                <React.Fragment>
                  {reviewData.length > 0 ? (
                    reviewData?.map((items) => {
                      return (
                        <ReviewCard
                          key={items.id}
                          reviewData={items}
                          deleteReview={deleteReview}
                          setShowPopup={setShowPopup}
                         updateReview={updateReview}
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-full flex justify-center items-center h-[300px]">
                      <h1 className="text-lg font-semibold">
                        No Reviews Found
                      </h1>
                    </div>
                  )}
                </React.Fragment>
              )}
              {/*  */}
            </div>
          </div>
        </div>
        <CommonProducts />
        {showPopup ? (
          <ReviewPopup
          selectedReviewedData={selectedReviewedData}
            setShowPopup={setShowPopup}
            popupHeading="Update Review"
            reviewId={reviewId}
            fetchAllReviews={fetchAllReviews}
            setUpdateReviews={setUpdateReviews}
            updateReviews={updateReviews}
            id={productId}
          />
        ) : (
          ""
        )}
      </Wrapper>
    </>
  );
};

export default Reviews;
