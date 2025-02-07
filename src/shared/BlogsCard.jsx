import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrapper } from "./Wrapper";
import { apiClient } from "../utils/apiWrapper";
import Skeleton from "react-loading-skeleton";
import { formatDateString } from "../utils/formatDate";

export const BlogsCard = ({ classes }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const fetchAttributes = async () => {
    try {
      const response = await apiClient.get("/get-views");
      setAttributes(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  const fetchBlogs = async () => {
    setLoader(true);
    try {
      const response = await apiClient.get("/posts");
      setBlogs(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const UpdatePostAttributes = async (id, type) => {
    const data = {};
    if (type == "like") {
      data.type = type;
      data.action = true;
    } else {
      data.type = type;
    }
    try {
      const response = await apiClient.put(`/posts/${id}`, data);
      fetchAttributes();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchAttributes();
  }, []);

  const handleNavigation = (item) => {
    const blogData = {
      id: item.id,
      image: item?.images[0],
      name: item?.author?.username,
      updatedAt: item?.updated_at,
      heading: item?.name,
      content: item?.content,
      views: item?.views,
      tags: item?.tags,
    };
    UpdatePostAttributes(item?.id, "view");
    navigate(`/blog-details/${item.id}`, { state: blogData });
  };

  return (
    <Wrapper classes="my-14 hidden sm:block">
      <div className="flex items-center justify-between">
        <h2 className="text-black-100 font-semibold text-[16px] py-[30px] sm:text-2xl">
          Our Latest News & Blogs
        </h2>
        <span
          onClick={() => navigate("/blog-listing")}
          className=" text-gray-700 cursor-pointer text-[12px] sm:text-lg"
        >
          View All Blogs
        </span>
      </div>
      <div className={`${classes} `}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4 gap-4">
          {!loader ? (
            blogs.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {index < 4 ? (
                    <div className="border-2 rounded-md p-2 sm:p-4 border-[#EEEEEE]">
                      <React.Fragment>
                        <div className="cursor-pointer">
                          <img
                            onClick={() => handleNavigation(item)}
                            className="w-full col-span-1 h-[300px] object-cover rounded-md"
                            src={`${item?.images[0]}`}
                            alt=""
                          />
                          <div className="flex justify-between items-center my-3">
                            <div className="flex justify-start items-center">
                              <img
                                src={`${item?.images[0]}`}
                                className="size-[30px] rounded-full"
                                alt="blog writer"
                              />
                              <span className="text-gray-700 text-[12px] md:text-[12] lg:text-[12px] xl:text-[12px] ml-2 whitespace-nowrap">
                                Written By -
                              </span>
                              <span className="text-[#BE2535] font-semibold ml-2 text-[12px] md:text-[12] lg:text-[12px] xl:text-[12px] ">
                                {" "}
                                {item?.author?.username
                                  ? item?.author?.username
                                      .charAt(0)
                                      .toUpperCase() +
                                    item?.author?.username.slice(1)
                                  : ""}
                              </span>
                            </div>
                            <span className="text-gray-700 ml-2 text-[12px] md:text-[12] lg:text-[12px] xl:text-[12px] text-end ">
                              Posted on{formatDateString(item?.updated_at)}
                            </span>
                          </div>
                          <h3 className="text-[#262626] text-md line-clamp-4 lg:text-lg my-3">
                            {item?.name}{" "}
                            {item?.name
                              ? item?.name.charAt(0).toUpperCase() +
                                item?.name.slice(1)
                              : ""}
                          </h3>
                          <div
                            onClick={() => handleNavigation(item)}
                            className="text-gray-700 text-[10px]  my-5 line-clamp-4 text-sm lg:text-md xl:text-base"
                          >
                            <p>{item?.content}</p>
                          </div>
                        </div>
                        <hr className="h-px my-3 bg-[#EEEEEE]"></hr>
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-row just">
                            <span
                              onClick={() =>
                                UpdatePostAttributes(item?.id, "view")
                              }
                              className="flex items-center cursor-pointer"
                            >
                              <img
                                src={process.env.PUBLIC_URL + "/icons/eye.png"}
                                alt=""
                              />{" "}
                              <span className="mx-3">
                                {attributes[index]?.views}
                              </span>
                            </span>
                            <span className="flex items-center cursor-pointer">
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/icons/message.png"
                                }
                                alt=""
                              />
                              <span className="mx-3">0</span>
                            </span>
                            <span
                              onClick={() =>
                                UpdatePostAttributes(item?.id, "share")
                              }
                              className="flex items-center cursor-pointer"
                            >
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/icons/share/share.png"
                                }
                                alt=""
                              />
                              <span className="mx-3">
                                {attributes[index]?.shares}
                              </span>
                            </span>
                          </div>
                          <span
                            onClick={() =>
                              UpdatePostAttributes(item?.id, "like")
                            }
                            className="flex items-center cursor-pointer"
                          >
                            <img
                              className="cursor-pointer"
                              src={
                                process.env.PUBLIC_URL + "/icons/heart-2.png"
                              }
                              alt=""
                            />
                            <span className="mx-3">
                              {attributes[index]?.likes}
                            </span>
                          </span>
                        </div>
                      </React.Fragment>
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })
          ) : (
            <React.Fragment>
              <div>
                <Skeleton height={"300px"} />
                <Skeleton className="mt-2" count={4} height={"30px"} />
                <Skeleton className="mt-2" height={"50px"} />
              </div>
              <div>
                <Skeleton height={"300px"} />
                <Skeleton className="mt-2" count={4} height={"30px"} />
                <Skeleton className="mt-2" height={"50px"} />
              </div>
              <div>
                <Skeleton height={"300px"} />
                <Skeleton className="mt-2" count={4} height={"30px"} />
                <Skeleton className="mt-2" height={"50px"} />
              </div>
              <div>
                <Skeleton height={"300px"} />
                <Skeleton className="mt-2" count={4} height={"30px"} />
                <Skeleton className="mt-2" height={"50px"} />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(BlogsCard);
