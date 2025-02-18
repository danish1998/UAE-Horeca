import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { Rating } from "./Rating";
import { BsPlusLg } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { apiClient } from "../utils/apiWrapper";
import { useCart } from "../context/CartContext";
import { useLocalCartCount } from "../context/LocalCartCount";
import { CartButton } from "./CartButton";
import { FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishListContext";
import { ProductCardCounter } from "../components/ProductCardCounter";

const ProductCard = ({
  classes,
  product,
  flashSale,
  browseWidth,
  removeItem,
  setTempSaveForLater,
}) => {
  const [deleteCartLoader, setDeleteCartLoader] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const productId = product.id ? product.id : product.product_id;
  let wishListItems = localStorage.getItem("wishListItems");
  const [autoplay, setAutoplay] = useState(false);
  const [count, setCount] = useState(1); // Local state for each card
  const [loader, setLoader] = useState(false);
  const [inWishList, setWishList] = useState(false);
  const sliderRef = useRef();
  const { triggerUpdateCart } = useCart();
  const { incrementWishListItems } = useLocalCartCount();
  const [cartSummaryFlag, setCartSummaryFlag] = useState(false);
  const [showCountButton, setShowCountButton] = useState(false);

  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [productState, setProductState] = useState(product);
  const { triggerUpdateWishList } = useWishlist();

  const settings = {
    dots: product?.images?.length > 1, // Show dots only if more than 1 image
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: autoplay,
    autoplaySpeed: 1000,
    cssEase: "linear",
  };

  const handlerIncrement = (e) => {
    setShowQuantity(false);
    e.preventDefault();
    e.stopPropagation();
    if (count < 100) {
      setCount(count + 1);
    }
  };
  const handlerDecrement = (e) => {
    setShowQuantity(false);
    e.preventDefault();
    e.stopPropagation();
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handlerRemoveFavouriteItem = async (product) => {
    if (authToken) {
      try {
        const response = await apiClient.delete(`/wishlist/remove`, {
          params: { product_id: productState.id },
        });
        productState.in_wishlist = false;
        triggerUpdateWishList();
        notify(productState.name, response.data.message);
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    } else {
      if (wishListItems) {
        let itemsArray = JSON.parse(wishListItems);
        let itemExists = itemsArray.findIndex((item) => item.id === product.id);
        if (itemExists != -1) {
          // If the item exists, delete from  wishlist
          itemsArray.splice(itemExists, 1);
          localStorage.setItem("wishListItems", JSON.stringify(itemsArray));
        }
      }
      product.in_wishlist = false;
      incrementWishListItems(-1);
      triggerUpdateWishList();
      notify(product.name, "Product removed from wishlist");
    }
  };

  const notify = (name, message) => {
    toast.dismiss();
    toast(<span className="line-clamp-4">{`${name} ${message}`}</span>);
  };

  //add wishlist

  const handlerAddFavouriteItem = async (product) => {
    if (authToken) {
      try {
        const response = await apiClient.post(`/wishlist/add`, {
          product_id: productState.id,
        });
        let temp = productState;
        productState.in_wishlist = true;
        setProductState(temp);
        triggerUpdateWishList();
        notify(productState.name, response.data.message);
      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
    } else {
      if (wishListItems) {
        let itemsArray = JSON.parse(wishListItems);
        let itemExists = itemsArray.findIndex((item) => item.id === product.id);

        if (itemExists == -1) {
          itemsArray.push(product);
          localStorage.setItem("wishListItems", JSON.stringify(itemsArray));
          incrementWishListItems(1);
        }
      } else {
        localStorage.setItem("wishListItems", JSON.stringify([product]));
        incrementWishListItems(1);
      }

      product.in_wishlist = true;

      triggerUpdateWishList();
      notify(product.name, "Product added to wishlist");
    }
  };

  const [showQuantity, setShowQuantity] = useState(false);

  const onMouseLeaveFunction = (video) => {
    setIsHovered(false);
    if (video && JSON.parse(video)[0]) {
      var playPromise = videoRef?.current?.pause();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            videoRef?.current?.pause();
          })
          .catch(() => {});
      }
    } else {
      sliderRef?.current?.slickPause();
    }
  };
  const onMouseEnterFunction = (video) => {
    setIsHovered(true);
    if (video && JSON.parse(video)[0]) {
      setTimeout(() => {
        var playPromise = videoRef?.current?.play();
        if (playPromise !== undefined) {
          playPromise
            .then((_) => {
              videoRef.current.play();
            })
            .catch(() => {});
        }
      }, 300);
    } else {
      sliderRef.current.slickPlay();
    }
  };

  const handleRemoveFromSaveForlater = async (id, name) => {
    try {
      const response = await apiClient.post(`/remove-from-save-for-later`, {
        product_id: id,
      });

      // notify(name, response.data.message);
    } catch (error) {
      console.log("error", error);
    }
  };
  const removeFromSaved = async (id, name) => {
    if (authToken) {
      handleRemoveFromSaveForlater(id, name);
    }
    const products = await JSON.parse(localStorage.getItem("SaveForLater"));
    const updateProduct = products.filter((item) => item.product_id != id);
    setTempSaveForLater(updateProduct);
    localStorage.setItem("SaveForLater", JSON.stringify(updateProduct));
    notify(name, " has been removed from saved.");
  };
  const removeFromSavedForAddToCart = async (id, name) => {
    if (authToken) {
      handleRemoveFromSaveForlater(id, name);
    }
    const products = await JSON.parse(localStorage.getItem("SaveForLater"));
    const updateProduct = products.filter((item) => item.product_id != id);
    setTempSaveForLater(updateProduct);
    localStorage.setItem("SaveForLater", JSON.stringify(updateProduct));
  };
  let itemsArray = JSON.parse(wishListItems);
  let itemExists =
    itemsArray && itemsArray.findIndex((item) => item.id === product.id) !== -1;

  useEffect(() => {
    setProductState(product);
  }, [product]);

  return (
    <React.Fragment>
      <div
        className={`${classes}  min-h-[290px] sm:min-h-[520px] block ${
          browseWidth ? "w-full" : "w-[183px]"
        }  sm:w-full group border-[#e2e8f0] relative rounded-[4px]  cursor-pointer product__card__wrapper group transition-all border z-[70] hover:border-primary duration-700`}
        onMouseLeave={() => onMouseLeaveFunction(product.video_path)}
        onMouseEnter={() => onMouseEnterFunction(product.video_path)}
      >
        {product.sale_price < product.original_price && (
          <React.Fragment>
            {product.sale_price ? (
              <p className="absolute min-w-[80px] text-center py-[5px] rounded-br-[20px] z-[60] top-0 left-0 bg-[#FCE8EA] text-sm font-semibold text-[#A6131D] inline-block">
                {(
                  ((product.original_price - product.sale_price) /
                    product.original_price) *
                  100
                ).toFixed(0)}
                % off
              </p>
            ) : null}
          </React.Fragment>
        )}
        <div
          className={
            window?.innerWidth < 640
              ? "overflow-hidden relative z-50 h-[120px] sm:h-[288px]"
              : "overflow-hidden relative z-50"
          }
        >
          <Link to={`/product/${productId}`}>
            {product.video_path && JSON.parse(product.video_path)[0] ? (
              <React.Fragment>
                <div className="flex items-center justify-center mt-[11px] relative">
                  {isHovered ? (
                    <video
                      ref={videoRef}
                      width="100%"
                      autoPlay={false}
                      muted={true}
                      loop={true}
                      className="hidden sm:block mt-[11px] sm:mt-[0px] w-[100%] h-[130px] sm:h-[236px] object-contain sm:object-contain"
                    >
                      <source
                        src={`${JSON.parse(product.video_path)[0]}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${product.images[0]}`}
                      alt={product.altText}
                      className="mt-[11px] sm:mt-[0px] w-[100%] h-[130px] sm:h-[236px] object-contain sm:object-contain"
                    />
                  )}
                </div>
                {window.innerWidth < 640 ?? (
                  <div className="size-8 bg-[#584f54] opacity-90 rounded-full flex items-center justify-center absolute bottom-3  left-3">
                    <FaPlay
                      color="white"
                      size={16}
                      opacity={"0.8"}
                      className="ml-1"
                    />
                  </div>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Slider {...settings} ref={sliderRef}>
                  {product?.images?.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <div className="flex items-center justify-center object-contain mt-[11px] sm:object-contain">
                        <img
                          src={`${image}`}
                          alt={product.altText}
                          className="h-[130px] sm:h-[236px] w-[100%]  object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </React.Fragment>
            )}
          </Link>
          <div className="absolute top-[20%] sm:top-[8%] translate-y-[-50%] border-gray-300 rounded-[4px] right-0 transition-all duration-500">
            {/* <VscGraph
              size={45}
              className="p-3 text-[#62666c] bg-white hover:text-white hover:bg-primary z-10 transition-all rounded-t-[4px]"
            /> */}
            {/* <LuEye
              size={45}
              className="p-3 border-b border-gray-300 mt-[10px] sm:mt-[0px] bg-white text-[#62666c] hover:text-white hover:bg-primary z-10 transition-all"
            /> */}
            {authToken ? (
              !productState.in_wishlist ? (
                <FaRegHeart
                  size={45}
                  onClick={(e) => handlerAddFavouriteItem(product)}
                  className="p-3 text-[#62666c] hover:text-[#186737] z-10 transition-all rounded-b-[4px]"
                />
              ) : (
                <GoHeartFill
                  size={45}
                  onClick={(e) => handlerRemoveFavouriteItem(product)}
                  className="p-3 text-[#186737] hover:text-[gray] z-10 transition-all rounded-b-[4px]"
                />
              )
            ) : !itemExists ? (
              <FaRegHeart
                size={45}
                onClick={(e) => handlerAddFavouriteItem(product)}
                className="p-3 text-[#62666c] hover:text-[#186737] z-10 transition-all rounded-b-[4px]"
              />
            ) : (
              <GoHeartFill
                size={45}
                onClick={(e) => handlerRemoveFavouriteItem(product)}
                className="p-3 text-[#186737] hover:text-[gray] z-10 transition-all rounded-b-[4px]"
              />
            )}
          </div>
        </div>
        <div className="mt-1 p-2  sm:p-4 mr-[0px] sm:mr-[10px]">
          <Link to={`/product/${productId}`}>
            {/* {product.leftStock <= 0 ? (
              <p className="text-[#A6131D] text-[10px] mt-[-10px] mb-[0px] sm:text-sm mt-2">
                Only available for pre-orders
              </p>
            ) : (
              <p className="text-[white] text-[10px] mt-[-10px] mb-[10px] sm:text-sm mt-2">
                .
              </p>
            )} */}
            <div className="">
              <h2 className="text-[12px] sm:text-lg font-normal sm:font-semibold line-clamp-4">
                {product.name}
              </h2>
            </div>
            <div className="flex items-center mt-1">
              <Rating rating={product.avg_rating ? product.avg_rating : "5"} />
              <span className="text-gray-700 text-[8px] sm:text-sm ml-2">
                {product.total_reviews ? product.total_reviews : "0"} Sold
              </span>
            </div>
            {!flashSale ? (
              <p className="hidden sm:block text-gray-700 text-[14px] mt-1">
                15% discount on first time order
              </p>
            ) : null}
            {flashSale ? (
              <div className="relative">
                <ul className="relative h-5 overflow-hidden pt-[1px]">
                  <li className="animate-slide-sequence delay-0 text-primary font-bold text-xs flex items-center">
                    <FaRegClock />{" "}
                    <span className="ml-2">SELLING OUT FAST</span>
                  </li>
                  <li className="animate-slide-sequence delay-2000 text-[#BE2535] font-bold text-xs flex items-center">
                    <FiTruck /> <span className="ml-2">FREE DELIVERY</span>
                  </li>
                  <li className="animate-slide-sequence delay-4000 text-secondary font-bold text-xs flex items-center">
                    <FiShoppingCart />{" "}
                    <span className="ml-2">5300+ SALE RECENTLY</span>
                  </li>
                </ul>
              </div>
            ) : null}
            <p className="font-normal sm:font-semibold text-[12px] sm:text-sm text-gray-700 mt-1">
              {product.delivery_days > 0 ? (
                <span>
                  {" "}
                  <span className="text-[black]">FREE DELIVERY</span> Get it as
                  soon as&nbsp;
                  {product.delivery_days} Days
                </span>
              ) : (
                <>
                  <span className="">Now Delivering Faster</span>
                </>
              )}
            </p>

            <div className="flex flex-col sm:flex-col items-baseline mb-2 mt-2">
              {/* Currency and Sale Price / Original Price */}
              <span className="flex flex-col items-baseline font-semibold">
                <span className="ml-0 text-[12px] sm:text-[18px] text-[#186737] font-bold">
                  {product.currency_title ? product.currency_title : "USD"}
                </span>
                <span
                  className={`ml-0 text-[24px] sm:text-[40px] font-bold sm:font-extrabold leading-none ${
                    product.sale_price && product.sale_price !== "0"
                      ? "text-[#186737]"
                      : "text-[#186737]"
                  }`}
                >
                  {
                    Number(
                      product.sale_price && product.sale_price !== "0"
                        ? product.sale_price
                        : product.original_price
                    )
                      .toFixed(2)
                      .split(".")[0]
                  }
                  <span className="text-[12px] sm:text-[16px] font-bold">
                    .
                    {
                      Number(
                        product.sale_price && product.sale_price !== "0"
                          ? product.sale_price
                          : product.original_price
                      )
                        .toFixed(2)
                        .split(".")[1]
                    }
                  </span>
                  <span className="text-[10px] ml-[3px] font-bold ml-[0px] sm:text-[14px] ml-0">
                    /&nbsp;PCS
                  </span>
                </span>
              </span>

              {/* Original Price (Strike-through if Sale Price is available) */}
              {product.sale_price &&
                Number(product.sale_price) > 0 &&
                Number(product.original_price) > 0 &&
                product.sale_price !== product.original_price && (
                  <span className="text-[#64748B] font-bold text-[12px] sm:text-[16px] line-through ml-0 mt-1 sm:mt-0 sm:ml-0">
                    {product.currency_title ? product.currency_title : "USD"}{" "}
                    {Number(product.original_price).toFixed(2)}
                  </span>
                )}
            </div>

            {!flashSale ? (
              <React.Fragment>
                {product.leftStock > 0 && product.leftStock <= 5 ? (
                  <p className="text-[#A6131D] text-sm mt-2">
                    Only {product.leftStock} left in stock - order soon.
                  </p>
                ) : null}
                {/* {product.leftStock <= 0 ? (
                  <p className="text-[#A6131D] text-[10px] sm:text-sm mt-2">
                    Only available for pre-orders
                  </p>
                ) : null} */}
                <span></span>
              </React.Fragment>
            ) : null}
          </Link>
          <div className="block sm:hidden">
            <div className={`${showCountButton === true ? "flex " : "hidden"}`}>
              <ProductCardCounter
                product={product}
                count={count}
                setShowCountButton={setShowCountButton}
                setCount={setCount}
                setCartSummaryFlag={setCartSummaryFlag}
                cartSummaryFlag={cartSummaryFlag}
                forMobile={true}
              />
            </div>
          </div>
          {/* {product.leftStock <= 0 ? (
            <p className="text-[white] text-[10px] mt-[-10px] mb-[0px] sm:text-sm mt-2">
              Only available for pre-orders
            </p>
          ) : (
            <p className="text-[white] text-[10px] mt-[-10px] mb-[0px] sm:text-sm mt-2">
              Only 4 left in stock - order soon.
            </p>
          )} */}
          <div className="flex items-center ">
            <div className="hidden mt-2 sm:flex items-center h-[44px] justify-between p-[2px] sm:px-3 sm:py-[2px] w-[90px] border border-[#BCE3C9] rounded-[4px]">
              <FiMinus
                className="cursor-pointer w-[10px] sm:w-[24px]"
                onClick={(e) => handlerDecrement(e)}
              />
              <span className="font-semibold text-primary mx-2 text-[10px] sm:text-[16px]">
                {String(count).padStart(2, "0")}
              </span>
              <BsPlusLg
                className="cursor-pointer w-[10px] sm:w-[24px]"
                onClick={(e) => handlerIncrement(e)}
              />
            </div>
            <div
              className="w-[100%]"
              onClick={
                removeItem &&
                (() => removeFromSavedForAddToCart(productId, product.name))
              }
            >
              <CartButton
                icon={true}
                quantity={count}
                setShowQuantity={setShowQuantity}
                showCountButton={showCountButton}
                setShowCountButton={setShowCountButton}
                product_id={productId}
                name={product.name}
                setQuantity={setCount}
                image={product.image}
                store_id={product.store_id}
                delivery_days={product.delivery_days}
                original_price={
                  product.sale_price
                    ? product.sale_price
                    : product.original_price
                }
                front_sale_price={product.price}
                maximum_order_quantity={product.maximum_order_quantity}
                minimum_order_quantity={product.minimum_order_quantity}
                currency_title={
                  product.currency_title ? product.currency_title : "USD"
                }
                images={product.images}
                video_path={product.video_path}
              >
                {window.innerWidth < 640 ? (
                  <>
                    <MdOutlineAddShoppingCart className="text-primary group-hover:text-white transition-all duration-500" />
                    <span className="ml-[-10px] text-[14px] pl-[10px] w-[150px] sm:ml-2 p-[2px] sm:p-0 font-semibold text-primary text-[10px] sm:text-base group-hover:text-white transition-all duration-500">
                      Add To Cart
                    </span>
                  </>
                ) : (
                  // <span
                  // // className={
                  // //   window?.innerWidth < 1367
                  // //     ? "ml-0 sm:ml-[1px] p-[2px] sm:p-0 font-semibold text-primary text-[8px] group-hover:text-white transition-all duration-500"
                  // //     : "ml-0 sm:ml-[1px] p-[2px] sm:p-0 font-semibold text-primary text-[8px] lg:text-[8px] 80p:text-base 110p:text-[14px] group-hover:text-white transition-all duration-500"
                  // // }
                  // >
                  <span className="ml-0 sm:ml-[1px] p-[2px] sm:p-0 font-semibold text-primary text-[18px] group-hover:text-white transition-all duration-500">
                    Add To Cart
                  </span>
                )}
              </CartButton>
            </div>
          </div>
          {/* This one is for phase 2 */}
          {showQuantity && (
            <div className="flex  mt-[10px] text-[13px] ">
              <p className="font-semibold text-[#186737]">{count} in basket </p>
              {/* <p className="font-semibold ml-[5px]">-</p> */}
              {/* <button className="font-semibold text-[#186737] ml-[5px]">
                Remove
              </button> */}
            </div>
          )}
          {removeItem ? (
            <button
              className="text-primary text-xs cursor-pointer"
              onClick={() => removeFromSaved(productId, product.name)}
            >
              Remove From Saved
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(ProductCard);
