import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../../utils/apiWrapper";
import { formatDate } from "../../../utils/formatDate";

const PopularPosts = ({ data }) => {
  const navigate = useNavigate();
  const [popularPost, setPopuparPost] = useState([]);
  const [viewedLoader, setViewedLoader] = useState(false);
  const fetchPopularPost = async () => {
    // const authToken = localStorage.getItem("authToken");
    // if (!authToken) {
    //   navigate("/login");
    // }
    try {
      setViewedLoader(true);
      const response = await apiClient.get("/popular-posts");
      setPopuparPost(response?.data?.data);
      setViewedLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setViewedLoader(false);
    }
  };

  const handleNavigation = (item) => {
    const blogData = {
      image: item?.images[0],
      name: item?.author?.username,
      updatedAt: item?.updated_at,
      heading: item?.name,
      content: item?.content,
      views: item?.views,
    };
    navigate(`/blog-details/${item?.id}`, { state: blogData });
  };

  useEffect(() => {
    fetchPopularPost();
  }, []);
  return (
    <>
      <div className="hidden lg:block w-[25%] mt-[90px]">
        <div className="border-2 my-[10px] rounded-lg p-[10px]">
          <h1 className="font-Montserrat m-[5px] text-[20px] leading-[30px] font-semibold">
            Popular Posts
          </h1>
          {popularPost?.map((post, index) => {
            return (
              <div
                key={index}
                onClick={() => handleNavigation(post)}
                className="flex items-center p-[10px] cursor-pointer"
              >
                <img
                  src={post.images[0]} // Replace with your actual image URL
                  alt="Knife Station"
                  className="w-[75px] h-[75px] rounded object-cover"
                />
                <div className="ml-[10px]">
                  <h1 className="text-[14px] mb-[5px] font-semibold text-black leading-[18px]">
                    {post?.name}
                  </h1>
                  <p className="text-[14px] leading-[17px] font-light">
                    {formatDate(post?.updated_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-2 my-[10px] rounded-lg">
          <img
            className="h-[626px] object-cover rounded-lg"
            src={`${process.env.PUBLIC_URL}/images/blog/blogImg/blog-1.png`}
          />
        </div>
        <div className="border-2 my-[10px] rounded-lg p-[10px]">
          <h1 className="font-Montserrat m-[5px] text-[20px] leading-[30px] font-semibold">
            Tags
          </h1>
          <div className="flex flex-wrap items-center">
            {data?.tags?.map((tag, index) => {
              return (
                <p className="py-[7px] m-[5px] px-[20px] text-[#666666] text-[14px] bg-[#EEEEEE] rounded-full">
                  {tag?.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PopularPosts;
