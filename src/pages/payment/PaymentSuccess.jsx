import React, { useEffect, useState } from "react";
import { Wrapper } from "../../shared/Wrapper";
import { useLocation, Link } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import DeiveryInfoCard from "../../components/DeliveryInfoCard";
import { MdOutlineEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { apiClient } from "../../utils/apiWrapper.js";
import { findDefaultAddress } from "../../utils/functions.js";
const PaymentSuccess = () => {
  const location = useLocation();
  const authToken = localStorage.getItem("authToken");
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  const guestInfo = JSON.parse(localStorage.getItem("guestUser")) || {};
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState();
  const [address, setAddress] = useState();
  const { triggerUpdateCart, updateTempCart } = useCart();
  const queryParams = new URLSearchParams(location.search);
  const [removeItemsLoader, setRemoveItemsLoader] = useState(false);
  const [lastestOrder, setLatestOrder] = useState(null);
 
  const fetchLastOrder = async (email) => {
    try {
      setLoader(true);
      const response = await apiClient.post('/orders/latest', {
        "email": email
      });
      setLatestOrder(response.data);
    } catch (error) {

    } finally {
      setLoader(false);
    }
  }

  const handlerRemoveAllItemsFromCart = async () => {
    setRemoveItemsLoader(true)
    try {
      const response = await apiClient.delete("/cart");
      if (response.data.success) {

        triggerUpdateCart();
        localStorage.removeItem('couponCodeValue');
        localStorage.removeItem('discountPercetage');
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRemoveItemsLoader(false)
    }
  }
  //temporary cart
  const handlerRemoveAllItemsFromCartTemp = async () => {
    setRemoveItemsLoader(true)
    localStorage.removeItem('CartItems');
    localStorage.removeItem('TotalCartItems');
    updateTempCart(0);
    setRemoveItemsLoader(false)

  }



  const handlerSendWhatsapp = () => {
    const message = `Check out this product: \n${
      lastestOrder.products[0].name
    }\nOriginal Price: ${lastestOrder.products[0].price}\nSale Price: ${
      lastestOrder.products[0].sale_price?lastestOrder.products[0].sale_price:lastestOrder.products[0].price
    }\nLink: ${
     process.env.PUBLIC_URL+lastestOrder.products[0].product_id
    }\nImage: ${lastestOrder.products[0].images[0]}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };
 


  const fetchAddress = async () => {
    setLoader(true);
    try {
      const response = await apiClient.get(`/addresses`);
      const defaultAdd = findDefaultAddress(response.data.data);
      setAddress(defaultAdd);
      setLoader(false);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAddress();
      setUserData(userProfile);
    } else {
      setUserData(guestInfo);
    }
    handlerRemoveAllItemsFromCart()
    handlerRemoveAllItemsFromCartTemp();
    triggerUpdateCart(); 
    window.scrollTo(0, 0);
  
  }, []);
 
  useEffect(()=>{
    if (!!userData && userData.email) {
      fetchLastOrder(userData.email);
    }
  },[userData]);
 
 

  return (
    <>
      <Wrapper className="h-screen ">
      <div className="p-[20px] bg-[#E2E8F066] mt-[20px] mb-[100px] rounded-[10px]">
        <div className="mt-0 grid grid-cols-12 gap-4 p-4 container mx-auto px-4  py-4 shadow-lg  bg-white">
          {/* Left Column: Content (takes 8/12 space) */}
          <div className="col-span-12 lg:col-span-8  p-4">
            <p className="mt-3 text-[#186737] font-semibold text-[20px] inline-flex items-center">
              <img
                src={process.env.PUBLIC_URL + "/icons/Frame.png"}
                alt=""
                style={{ backgroundColor: '#186737', marginRight: '8px', borderRadius: '20px' }}
              />
              Congratulations, Successfully Order Placed
            </p>
            <br />
            <p className="mt-3 text-[#64748B] font-semibold text-[16px]  items-center">
              Confirmation will be sent to your email at  <span className="text-[#186737]">{userData && userData.email}</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-10 gap-4 mt-2 text-[#64748B] font-semibold text-[11px] md:text-[12px] lg:text-[14px] inline-flex items-center">
              {/* Text - Span 12 columns on small screens, 8 on medium screens, 7 on large screens */}
              <div className="col-span-12 md:col-span-8 lg:col-span-7">
                Our Representative will call you at &nbsp;
                <span className="text-[#030303] font-bold">{userData && userData?.phone?userData?.phone:userData?.number}</span>. Kindly ensure the number is correct to avoid delivery delays or add&nbsp;
              </div>

              {/* Input Field - Span 12 columns on small screens, 4 on medium screens, 3 on large screens */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3 flex items-stretch border-2 border-green-500 rounded-lg overflow-hidden">
  <input
    type="tel"
    className="text-[#030303] font-bold p-2 flex-1 text-sm w-full min-w-0 focus:outline-none"
    name="alteNumber"
    placeholder="Second Number"
  />
  <img
    src={process.env.PUBLIC_URL + "/icons/Frame.png"}
    alt="icon"
    className="w-9 h-auto bg-[#186737] p-2 flex-shrink-0"
  />
</div>
            </div>


            <br />
            {!!address && address ?
              <>
                <p className="mt-3 text-[#030303] font-bold text-[14px] inline-flex items-center">
                  Being Delivered To {address.address}
                </p>
                <br />
                <p className="mt-1 text-[#212121] font-semibold text-[14px] inline-flex items-center">

                  {address.address}  {address.city}  {address.state} {address.zip_code} {address.country}
                </p></> : null}


            <div className="mt-5 mb-3 border-t-2 border-[#E2E8F0]" />

            <DeiveryInfoCard lastestOrder={lastestOrder && lastestOrder}/>
         

            <div className="flex items-center justify-start mt-3">
              <h2 className="text-[#262626] font-semibold text-base">
                Share this Details
              </h2>
              <div 
                 onClick={() => handlerSendWhatsapp()}
              className="border-[#E2E8F0] border-2 rounded-full p-3 ml-5 cursor-pointer hover:bg-primary transition-all hover:text-white">
                <FaWhatsapp size={16} />
              </div>
              {/* <div className="border-[#E2E8F0] border-2 rounded-full p-3 ml-3 cursor-pointer hover:bg-primary transition-all hover:text-white">
                <MdOutlineEmail size={16} />
              </div> */}
            </div>

            <div className="mt-5 mb-3 border-t-2 border-[#E2E8F0]" />

            <div className="flex items-center justify-start mt-3">
              <h2 className="text-[#262626] font-semibold text-base">
                Want to receive notification on WhatsApp?
              </h2>
            </div>
            <p className="mt-1 text-[#64748B] font-semibold text-[14px] inline-flex items-center">
              Get notified on WhatsApp when we need more details to deliver your package. If you agree to receive WhatsApp notifications, you agree with the Terms & Conditions.
            </p>

            <button 
             onClick={() => handlerSendWhatsapp()}
            className="flex mt-[5px] items-center justify-center rounded-md font-sans w-[250px] sm:w-[250px] h-[40px] border border-[#666666] text-[16px] text-[#ffffff] font-medium leading-[16px] text-left underline-offset-auto decoration-slice bg-[#64748B]">
              Get WhatsApp Notification
            </button>
          </div>

          {/* Right Column: Thank You Image (takes 4/12 space) */}
          <div className="col-span-12 lg:col-span-4 flex items-center justify-center p-4 ">
            <img
              src={process.env.PUBLIC_URL + "/images/checkout/thank you banner.png"}
              alt="Thank You"
              className="rounded-lg shadow-md"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
        </div>
      </Wrapper>


    </>
  );
};

export default PaymentSuccess;
