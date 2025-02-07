import React, { useEffect, useState } from "react";
import { Wrapper } from "../../shared/Wrapper";
import { Breadcrumb } from "../../shared/Breadcrumb";
import { BlogPostCard } from "./components/BlogPostCard";
import { useLocation, useParams } from "react-router";
import { formatDateString } from "../../utils/formatDate";
import PopularPosts from "./components/PopularPosts";
import { apiClient } from "../../utils/apiWrapper";
import BlogsCard from "../../shared/BlogsCard";
import Skeleton from "react-loading-skeleton";

const BlogDetails = () => {
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [blog, setBlog] = useState(null);
  const data = location.state;
 
  const { id } = useParams();

  const fetchBlogs = async () => {
    setLoader(true);
    try {
      const response = await apiClient.get(`/posts/${id}`);

      setBlog(response?.data?.data);
      setLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const collectionBreadCrumb = [
    {
      url: "/home",
      title: "Home",
    },
    {
      url: "/home",
      title: "BlogDetails",
    },
    {
      title: data.heading,
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  return (
    <>
      <div className="block sm:hidden pl-[8px]">
        <Breadcrumb items={collectionBreadCrumb} classes={"mt-[10px]"} />
      </div>
      <Wrapper>
        <div className="hidden sm:block">
          <Breadcrumb items={collectionBreadCrumb} classes={"mt-[10px]"} />
        </div>
      </Wrapper>
      <div>
        <img
          className="block sm:hidden mt-[20px] h-[240px] object-cover"
          src={`${blog?.images[0]}`}
        />
      </div>
      <Wrapper>
        {loader == true ? (
          <div className="col-span-1 mt-3">
            <Skeleton className="w-full h-[750px]" />
          </div>
        ) : (
          <div className="hidden sm:flex mt-[10px] mb-[10px] text-[32px] m-[0px] font-bold text-white h-[160px] overflow-hidden rounded-[15px] sm:h-[700px] w-full">
            <img className="" src={`${blog?.images[0]}`} />
          </div>
        )}
        {loader == false && (
          <div className="flex">
            {/* First Container */}
            <div className="m-[10px] w-[100%] lg:w-[75%]">
              <div className="hidden sm:flex items-center gap-2">
                <img
                  src={`${blog?.images[0]}`}
                  alt="Author"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-gray-400 text-[20px]">
                    Written By -{" "}
                    <span className="text-red-600 font-semibold">
                      {blog?.name
                        ? blog.name.charAt(0).toUpperCase() + blog.name.slice(1)
                        : ""}
                    </span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    Posted {formatDateString(blog?.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="mt-[20px]">
                <h1 className="text-[18px] sm:text-[36px] mb-[20px] font-bold leading-[54px]">
                  {blog?.heading}
                </h1>
                <p className="text-[14px] sm:text-[16px] w-[98%] leading-[35px] text-[#64748B] font-light">
                  {blog?.content}
                </p>
              </div>
            </div>
            {/* Second Container */}
            <PopularPosts data={blog} />
          </div>
        )}
        <div className="m-[0px] sm:m-[10px] w-[100%] lg:w-[100%]">
          <BlogsCard />
        </div>
      </Wrapper>
    </>
  );
};

export default BlogDetails;
