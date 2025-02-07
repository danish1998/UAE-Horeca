import React, { useEffect, useState } from "react";
import { megaDeals } from "../data/Collections";
import { ExploreBrandImages } from "../data/Collections";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "../shared/Wrapper";
import { Breadcrumb } from "../shared/Breadcrumb";
import { apiClient } from "../utils/apiWrapper";
import { useParams } from "react-router-dom";
import { FullScreenLoader } from "../shared/Loader";

import SuggestionSlider from "../hooks/suggestionSlider/SuggestionSlider";

const CollectionPage = () => {
  const navigation = useNavigate();
  const [selectedCat, setSelectedCat] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const pageName = location.pathname.split("/")[2];
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [productLoader, setProductLoader] = useState(false);
  const [categoryLoader, setCategoryLoader] = useState(false);

  const handelNavigation = async (path) => {
    await navigation(path, { state: { type: 1 } });
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoader(true);
      const response = await apiClient.get(`/category-with-slug/${pageName}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCategoryLoader(false);
    }
  };

  const fetchProducts = async () => {
    setProductLoader(true);
    const authToken = localStorage.getItem("authToken");
    const response = await apiClient.get(
      `${authToken ? "/products" : "/products-guest"}`
    );
    setProductLoader(false);
    setProducts(response.data.data.data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategories();
    fetchProducts();
  }, [id]);

  const collectionBreadCrumb = [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "/all-categories",
      title: "Categories",
    },
    {
      title: categories ? categories.name : "",
    },
  ];

  return (
    <>
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
      {/* Main Page  */}
      <Wrapper>
        <div className="grid grid-cols-9 gap-4">
          <div className="col-span-9 mt-8">
            {/* Collection Header  */}
            <div className="flex items-center justify-center text-center flex-col">
              <h2 className="text-black-100 text-[16px] sm:text-[22px] font-medium sm:font-semibold">
                {categories?.name}{" "}
              </h2>
              <p className="hidden sm:block text-base text-gray-700 px-16 mt-2 sm:ellipsis-text">
                Find top-notch commercial kitchen equipment for restaurants. We
                offer a wide range of products from trusted brands
                like Beckers, Rational, Cambro, Empero, Coupe, Lacor, and Roller
                Grill. Whether you're outfitting a new kitchen or upgrading your
                current setup.
              </p>
              <p className="block sm:hidden text-[14px] font-normal w-[100vw] text-gray-700 px-[5px] mt-2">
                Find top-notch commercial kitchen equipment restaurants We offer
                a wide range products.
              </p>
            </div>

            {/* Collection Category  */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-5 mt-8">
              {categoryLoader ? (
                <FullScreenLoader />
              ) : (
                !!categories &&
                categories?.children?.map((cat, index) => {
                  const isVisible =
                    window?.innerWidth < 640 ? index < 8 : index < 14;
                  return isVisible ? (
                    <React.Fragment key={index}>
                      <div
                        className="flex flex-col"
                        onClick={() =>
                          handelNavigation(
                            `/collections/${id}/${cat.slug}/${cat.id}`
                          )
                        }
                      >
                        <div
                          className={` border-[#D9D9D9] bg-[#F5F5F5] border-2 h-[200px] w-[200px] sm:w-[220px] sm:h-[220px] flex items-center justify-center cursor-pointer transition-all hover:border-primary p-2 rounded-md ${
                            cat?.id === selectedCat?.id
                              ? "border-primary"
                              : "border-[#D9D9D9]"
                          }`}
                        >
                          <img
                            className="h-full w-full object-contain"
                            src={`${cat.image}`}
                            alt={cat.name} 
                          />
                        </div>
                        <h4 className="mt-2 text-[16px] font-normal text-[#186737] font-semibold text-center">
                          {cat.name}
                        </h4>
                      </div>
                    </React.Fragment>
                  ) : null;
                })
              )}
            </div>

            <div className="hidden sm:grid grid-cols-2  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-5 gap-8 mt-8">
              {categories && categories.children
                ? categories.children.map((cat, index) => {
                    return (
                      <div
                        key={index}
                        className="grid-cols-1 p-5 border border-gray-300  rounded-[4px] flex  flex-col transition-all hover:border-primary"
                      >
                        <Link
                          key={index}
                          className="mt-1 block text-[#666666] text-base underline"
                          to={`/collections/${id}/${cat.slug}/${cat.id}`}
                        >
                          <div className="flex items-center justify-center h-[230px] overflow-hidden">
                            <img
                              className="h-[230px]"
                              src={
                                cat.image
                                  ? cat.image
                                  : `${process.env.PUBLIC_URL}/images/categories/coffeemachines.png`
                              }
                              alt={cat.name}
                            />
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <h4 className="text-primary text-lg font-semibold">
                              {cat.name}
                            </h4>
                            <span className="text-primary text-sm flex justify-end  flex-row min-w-[120px]">
                              {cat.children.length} Categories{" "}
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/icons/arrow-right.png"
                                }
                                alt=""
                              />
                            </span>
                          </div>
                        </Link>
                        <div className="border bg-[#E2E8F0] w-full h-[1px] my-4"></div>
                        <div className="overflow-y-auto max-h-[250px]">
                          {cat.children
                            ? cat.children.map((cat2) => {
                                return (
                                  <div
                                    key={cat2.id}
                                    className="mt-1 block text-[#666666] text-base underline cursor-pointer"
                                    onClick={() =>
                                      handelNavigation(
                                        `/collections/${id}/${cat2.slug}/${cat2.id}`
                                      )
                                    }
                                  >
                                    {cat2.name}
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        <div className="py-10 px-6 bg-[#E2E8F033] mt-10 rounded-[20px]">
          <div className="flex items-center justify-center text-center flex-col">
            <h3 className="text-black-100 text-[16px] sm:text-[22px] font-semibold">
              Horeca Mega Deals
            </h3>
            <p className="hidden sm:block text-base text-gray-700 px-16 mt-2 sm:ellipsis-text">
              Find top-notch commercial kitchen equipment for restaurants. We
              offer a wide range of products from trusted brands
              like Beckers, Rational, Cambro, Empero, Coupe, Lacor, and Roller
              Grill. Whether you're outfitting a new kitchen or upgrading your
              current setup.
            </p>
            <p className="block sm:hidden text-[14px] font-normal w-[100vw] text-gray-700 px-[5px] mt-2">
              Find top-notch commercial kitchen equipment restaurants We offer a
              wide range products.
            </p>
          </div>
          {window?.innerWidth > 640 && (
            <div className="grid grid-cols-3 mt-5 gap-6">
              {megaDeals
                ? megaDeals.map((items, index) => {
                    return (
                      <Link
                        key={index}
                        to={items.redirectLink}
                        className="mt-2 mr-[10px]"
                      >
                        <img src={items.img} alt="" />
                      </Link>
                    );
                  })
                : null}
            </div>
          )}
          {window?.innerWidth < 640 && (
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {megaDeals
                ? megaDeals.map((items, index) => (
                    <Link
                      key={index}
                      to={items.redirectLink}
                      className="snap-center flex-shrink-0 w-full"
                    >
                      <img
                        className="w-full h-auto object-cover"
                        src={items.img}
                        alt=""
                      />
                    </Link>
                  ))
                : null}
            </div>
          )}
        </div>
        <SuggestionSlider
          title={"Top Picks in Santos"}
          productList={products && products}
          keys={1}
          productLoader={productLoader}
        />
        <div className="w-full my-8">
          {window?.innerWidth < 640 && (
            <img
              className="h-[160px] sm:h-[100%] w-[100vw] border"
              src={
                process.env.PUBLIC_URL + "/images/collectonBanners/image.png"
              }
              alt=""
            />
          )}
          {window?.innerWidth > 640 && (
            <img
              className="h-[160px] sm:h-[100%] w-[100vw] border"
              src={
                process.env.PUBLIC_URL +
                "/images/collections/perfect-design.png"
              }
              alt=""
            />
          )}
        </div>

        <SuggestionSlider
          title={"Top deals from our sellers"}
          productList={products && products}
          keys={2}
          productLoader={productLoader}
        />

        <div className="w-full my-8">
          {window?.innerWidth < 640 && (
            <img
              className="h-[160px] sm:h-[100%] w-[100vw] border"
              src={
                process.env.PUBLIC_URL + "/images/collectonBanners/image-1.png"
              }
              alt=""
            />
          )}
          {window?.innerWidth > 640 && (
            <img
              className="h-[160px] sm:h-[100%] w-[100vw] border"
              src={
                process.env.PUBLIC_URL +
                "/images/collections/perfect-served.png"
              }
              alt=""
            />
          )}
        </div>

        <SuggestionSlider
          title={"Explore top picks"}
          productList={products && products}
          keys={3}
          productLoader={productLoader}
        />

        <div className="w-full my-8">
          {window?.innerWidth < 640 && (
            <img
              className="h-[160px] sm:h-[100%] w-[100vw] border"
              src={
                process.env.PUBLIC_URL + "/images/collectonBanners/image-2.png"
              }
              alt=""
            />
          )}
          {window?.innerWidth > 640 && (
            <img
              className="h-[160px] sm:h-[100%] w-[100vw] border"
              src={process.env.PUBLIC_URL + "/images/collections/dine-in.png"}
              alt=""
            />
          )}
        </div>

        <SuggestionSlider
          title={"Hot new releases"}
          productList={products && products}
          keys={4}
          productLoader={productLoader}
        />

        <div className="py-10 pb-20 px-1 sm:px-6 bg-[#E2E8F033] mt-10 rounded-[20px]">
          <div className="flex items-center justify-center text-center flex-col">
            <h3 className=" font-medium sm:font-semibold text-[16px] sm:text-[22px] text-black-100 ">
              Explore official brand stores
            </h3>
            <p className="hidden sm:block text-base text-gray-700 px-16 mt-2 sm:ellipsis-text">
              Find top-notch commercial kitchen equipment for restaurants. We
              offer a wide range of products from trusted brands
              like Beckers, Rational, Cambro, Empero, Coupe, Lacor, and Roller
              Grill. Whether you're outfitting a new kitchen or upgrading your
              current setup.
            </p>
            <p className="block sm:hidden text-[14px] font-normal w-[100vw] text-gray-700 px-[5px] mt-2">
              Find top-notch commercial kitchen equipment restaurants We offer a
              wide range products.
            </p>
          </div>
          {window?.innerWidth < 640 && (
            <div
              style={
                window.innerWidth < 640
                  ? {
                      overflow: "auto",
                      scrollbarWidth: "none", // For Firefox
                      msOverflowStyle: "none", // For Internet Explorer and Edge
                    }
                  : {}
              }
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
              {ExploreBrandImages
                ? ExploreBrandImages.map((items, index) => (
                    <Link
                      key={index}
                      to={items.redirectLink}
                      className="snap-center flex-shrink-0 mr-[10px] w-[50vw]"
                    >
                      <img
                        className="w-full mx-[10px] h-auto object-cover rounded-lg"
                        src={items.img}
                        alt=""
                      />
                    </Link>
                  ))
                : null}
            </div>
          )}

          <div className="hidden sm:grid grid-cols-4 gap-4 mt-5">
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-1.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-2.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-3.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-4.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-5.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-6.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-7.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-8.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-9.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-10.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-11.png"
                }
                alt=""
              />
            </div>
            <div className="col-span-1">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/collections/brands/brand-12.png"
                }
                alt=""
              />
            </div>
          </div>
        </div>

        <SuggestionSlider
          title={"Products you may also like"}
          productList={products && products}
          keys={5}
          productLoader={productLoader}
        />

        <SuggestionSlider
          title={"Inspired by your browsing history"}
          productList={products && products}
          key={6}
          productLoader={productLoader}
        />

        <SuggestionSlider
          title={"Inspired by your browsing history"}
          productList={products && products}
          productLoader={productLoader}
        />
      </Wrapper>
    </>
  );
};

export default React.memo(CollectionPage);
