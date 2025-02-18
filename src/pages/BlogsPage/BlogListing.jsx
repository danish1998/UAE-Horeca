import React from "react";
import { Wrapper } from "../../shared/Wrapper";
import { Breadcrumb } from "../../shared/Breadcrumb";
import { BlogsCard } from "../../shared/BlogsCard";
import { BlogPostCard } from "./components/BlogPostCard";
import PopularPosts from "./components/PopularPosts";

const BlogListing = () => {
  const collectionBreadCrumb = [
    {
      url: "/",
      title: "Home",
    },
    {
      title: "BlogListing",
    },
  ];

  return (
    <>
      <Wrapper>
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-[10px]"} />
      </Wrapper>
      <div className="flex mt-[10px] text-[32px] font-bold text-white h-[160px] sm:h-[450px] w-full bg-gray-400">
        <img
          className="absolute h-[160px] sm:h-[450px] w-full object-cover opacity-[0.5]"
          src="https://images.pexels.com/photos/7689734/pexels-photo-7689734.jpeg?auto=compress&cs=tinysrgb&w=800"
        />
        <div className="hidden xl:block relative p-[10px] sm:p-20 w-[100%]">
          <p className="text-[20px] ml-0 sm:ml-[3%] text-center sm:text-left sm:text-[54px] leading:[10px] sm:leading-[63.34px] w-full sm:w-[50vw]">
            Our global reach is your playground.
          </p>
          <p className="hidden sm:block text-[12px] sm:text-[16px] ml-0  sm:ml-[3%] text-center sm:text-left sm:text-start w-[100%] sm:w-[70%] font-normal leading-[22px] text-white mt-[0px] sm:mt-[20px]">
            At Sell at HORECA, we specialize in helping businesses sell more by
            acting fast while minimizing risk. Our solutions are tailored to the
            hospitality industry's needs, ensuring success and profitability.
          </p>
          <p className="block sm:hidden text-[12px] sm:text-[16px] ml-0  sm:ml-[3%] text-center sm:text-left sm:text-start w-[100%] sm:w-[70%] font-normal leading-[22px] text-white mt-[0px] sm:mt-[20px]">
            At Sell at HORECA, we specialize in helping businesses sell more by
            acting fast while minimizing risk.
          </p>
          <div className="flex items-center justify-center sm:justify-start mt-[10px]">
            <button className="w-[150px] text-center ml-[3%] sm:w-[204px] h-[32px] sm:h-[40px] sm:h-[60px] bg-[#186737] text-[12px] sm:text-[16px] mt-[10px] sm:mt-[30px] rounded font-semibold">
              Join Marketplace
            </button>
          </div>
        </div>
      </div>
      <Wrapper>
        <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4 mt-[40px] sm:mt-[100px]">
          <div className="h-auto w-full max-w-[305px] rounded-md">
            <div className="w-full h-auto rounded-md">
              <img
                className="w-full h-auto object-cover rounded-md"
                src={`${process.env.PUBLIC_URL}/images/blog/card/cafe.png`}
                alt="News & Articles"
              />
            </div>
            <p className="text-center text-[18px] sm:text-[24px] sm:text-[24px] leading-[28px] sm:leading-[30px] text-light text-[#186737] my-[10px]">
              News & Article
            </p>
          </div>
          <div className="h-auto w-full max-w-[305px] rounded-md">
            <div className="w-full h-auto rounded-md">
              <img
                className="w-full h-auto object-cover rounded-md"
                src={`${process.env.PUBLIC_URL}/images/blog/card/hotels.png`}
              />
            </div>
            <p className="text-center w-[100%] text-[18px] sm:text-[24px] leading-[30px] text-light text-[#186737] my-[10px]">
              Hotels
            </p>
          </div>
          <div className="h-auto w-full max-w-[305px] rounded-md">
            <div className="w-full h-auto rounded-md">
              <img
                className="w-full h-auto object-cover rounded-md"
                src={`${process.env.PUBLIC_URL}/images/blog/card/news.png`}
              />
            </div>
            <p className="text-center w-[100%] text-[18px] sm:text-[24px] leading-[30px] text-light text-[#186737] my-[10px]">
              Restaurants
            </p>
          </div>
          <div className="h-auto w-full max-w-[305px] rounded-md">
            <div className="w-full h-auto rounded-md">
              <img
                className="w-full h-auto object-cover rounded-md"
                src={`${process.env.PUBLIC_URL}/images/blog/card/restaurant.png`}
              />
            </div>
            <p className="text-center w-[100%] text-[18px] sm:text-[24px] leading-[30px] text-light text-[#186737] my-[10px]">
              Cafes
            </p>
          </div>
          <div className="h-auto w-full max-w-[305px] rounded-md">
            <div className="w-full h-auto rounded-md">
              <img
                className="w-full h-auto object-cover rounded-md"
                src={`${process.env.PUBLIC_URL}/images/blog/card/news.png`}
              />
            </div>
            <p className="text-center w-[100%] text-[18px] sm:text-[24px] leading-[30px] text-light text-[#186737] my-[10px]">
              Food & Beverages
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center mt-[0px] sm:mt-[130px]">
          <h1 className="text-[18px] sm:text-[30px] font-semibold leading-[21px] sm:leading-[35px] text-center">
            News & Articles
          </h1>
          <p className="text-[12px] sm:text-[16px] font-normal mt-[5px] sm:mt-[20px] mb-[20px] leading-[18px] sm:leading-[30px] text-[#64748B] w-[100%] sm:w-[90%] xl:w-[60%]  xl:w-[60%]  text-center">
            At HorecaStore, you can sell a wide range of products tailored for
            the hospitality industry, from kitchen equipment to dining
            essentials. Explore our platform to list everything from
            high-quality Products!
          </p>
        </div>
        <div className="flex">
          {/* First Container */}
          <div className="m-[10px] w-[100%] lg:w-[75%]">
            <BlogPostCard />
          </div>
          {/* Second Container */}
          <PopularPosts />
        </div>
      </Wrapper>
    </>
  );
};

export default BlogListing;
