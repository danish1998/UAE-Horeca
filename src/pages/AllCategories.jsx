import React, { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import { Wrapper } from "../shared/Wrapper";
import { Breadcrumb } from "../shared/Breadcrumb";
import Categories from "../hooks/categories/Categories";
import { apiClient } from "../utils/apiWrapper";
import AllCategoriesData from "../hooks/categories/AllCategoriesData";

const AllCategories = () => {
  const [menuCategory, setMenuCategory] = useState({});

  const fetchHomeCategories = async () => {
    try {
      const response = await apiClient.get("/all-categories");
      setMenuCategory(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };
  useEffect(() => {
    fetchHomeCategories();
  }, []);
  const collectionBreadCrumb = [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "",
      title: "All Categories",
    },
  ];
  return (
    <div>
      <Wrapper>
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-7"} />
      </Wrapper>
      {/* TopHeaderImage  */}
      <div className="hidden sm:block w-full  mt-5">
        <img
          className="w-full"
          src={process.env.PUBLIC_URL + "/images/categoryBanner.png"}
          alt=""
        />
      </div>
      <Wrapper>
        <div className="flex items-center justify-center text-center flex-col mt-[60px]">
          <h2 className="text-black-100 text-[16px] sm:text-[22px] font-medium sm:font-semibold">
            All Categories
          </h2>
          <p className="hidden sm:block text-base text-gray-700 px-16 mt-2 sm:ellipsis-text">
            Find top-notch commercial kitchen equipment for restaurants. We
            offer a wide range of products from trusted brands
            like Beckers, Rational, Cambro, Empero, Robot Coupe, Lacor,
            and Roller Grill. Whether you're outfitting a new kitchen or
            upgrading your current setup.
          </p>
          <p className="block sm:hidden text-[14px] font-normal w-[100vw] text-gray-700 px-[5px] mt-2">
            Find top-notch commercial kitchen equipment for restaurants. We
            offer a wide range of products from trusted brands
            like Beckers, Rational, Cambro, Empero, Robot Coupe, Lacor,
            and Roller Grill. Whether you're outfitting a new kitchen or
            upgrading your current setup.
          </p>
        </div>
        <div className="pb-[20px]">
          <AllCategoriesData categories={menuCategory} title={false} />
        </div>
      </Wrapper>
    </div>
  );
};

export default AllCategories;
