import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { apiClient } from "../utils/apiWrapper";
import { useLocalCartCount } from "../context/LocalCartCount";
import { notify } from "../utils/notify";
export const CartButton = ({
  product_id,
  quantity,
  classes,
  icon,
  setQuantity,
  children,
  name,
  setShowCountButton,
  image,
  store_id,
  showCountButton,
  delivery_days,
  original_price,
  front_sale_price,
  currency_title,
  maximum_order_quantity,
  setShowQuantity,
  minimum_order_quantity,
  images,
  video_path,
}) => {
  const { triggerUpdateCart } = useCart();
  const { totalCartItems, incrementCartItems } = useLocalCartCount();
  const [loader, setLoader] = useState(false);
  const [buttonShow, setButtonShow] = useState(false);

  const handlerSubmit = async () => {
    const authToken = localStorage.getItem("authToken");
    setShowQuantity(true);
    setLoader(true);
    if (authToken) {
      try {
        setLoader(true);
        const response = await apiClient.post(`/cart`, {
          product_id: product_id,
          quantity: quantity,
        });
        if (response.data.success) {
          notify(name, "has been added to your cart");
          setLoader(false);
          setShowCountButton(true);
          setButtonShow(true);
          setTimeout(() => {
            setShowQuantity(false);
            setQuantity ? setQuantity(1) : console.log();
          }, 20000);
          triggerUpdateCart();
        } else {
          notify("error", "Some error occured.");
        }
      } catch (error) {
        console.error("Error:", error);
        setShowQuantity(false);
      } finally {
        setLoader(false);
        setTimeout(() => {
          setShowQuantity(false);
        }, 20000);
      }
    } else {
      setTimeout(() => {
        setLoader(false);
        setShowQuantity(false);
      }, 500);
      let cartItems = localStorage.getItem("CartItems");
      let tempObj = {
        product_id: product_id,
        quantity: quantity,
        name: name,
        image: image,
        store_id: store_id,
        delivery_days: delivery_days,
        original_price: original_price,
        front_sale_price: front_sale_price,
        currency_title: currency_title,
        maximum_order_quantity: maximum_order_quantity,
        minimum_order_quantity: minimum_order_quantity,
        images: images,
        video_path: video_path,
      };
      if (cartItems) {
        let itemsArray = JSON.parse(cartItems);
        let itemExists = itemsArray.findIndex(
          (item) => item.product_id === product_id
        );
        if (itemExists != -1) {
          // If the item exists, update the quantity
          itemsArray[itemExists].quantity += quantity;
        } else {
          itemsArray.push(tempObj);
        }
        localStorage.setItem("CartItems", JSON.stringify(itemsArray));
      } else {
        localStorage.setItem("CartItems", JSON.stringify([tempObj]));
      }
      incrementCartItems(quantity);
      triggerUpdateCart();
      notify(name, "has been added to your cart");
      setTimeout(() => {
        setQuantity ? setQuantity(1) : console.log();
      }, 2000);
    }
  };
  return (
    <React.Fragment>
      {!icon ? (
        <button
          className={`${
            classes
              ? classes
              : "text-[#F9FAFC] bg-primary px-4 py-2 pt-[20px]   rounded-md w-full sm:max-w-32 mx-auto font-semibold"
          }`}
          style={{ opacity: `${loader ? "0.5" : ""}` }}
          disabled={loader}
          onClick={() => handlerSubmit()}
        >
          <p className="mt-[-15px]">Buy Now</p>
        </button>
      ) : (
        <button
          className={`${
            classes
              ? classes
              : `${
                  showCountButton == true && window.innerWidth < 640
                    ? "hidden "
                    : "flex"
                } items-center justify-center bg-[#DEF9EC] p-[4px] sm:p-[8px] w-full px-4 rounded-[4px] ml-0 sm:ml-2 mt-2 group-hover:bg-primary transition-all duration-500`
          }`}
          style={{ opacity: `${loader ? "0.5" : "1"}` }}
          disabled={loader}
          onClick={() => handlerSubmit()}
        >
          {children}
        </button>
      )}
    </React.Fragment>
  );
};
