import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wrapper } from "../shared/Wrapper";
import { apiClient } from "../utils/apiWrapper";
const Footer = () => {
  const location = useLocation();
  const [footerMenu, setFooterMenu] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    console.log("event", e);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    if (!formData.email) {
      errors.email = "Enter your email address";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    } else {
      console.log("error");
    }
  };

  const isFormValid = Object.keys(errors).length === 0;
  const fetchMenu = async () => {
    try {
      const response = await apiClient.get("/menus");
      setFooterMenu(response?.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // setLoader(false);
    }
  };

  const [maxIndex, setMaxIndex] = useState(0); // To control how many categories to show

  useEffect(() => {
    fetchMenu();

    const updateMaxIndex = () => {
      const width = window.innerWidth;
      if (width >= 1920) {
        setMaxIndex(7); // For very large screens
      } else if (width >= 1600) {
        setMaxIndex(7);
      } else if (width >= 1536) {
        setMaxIndex(7);
      } else if (width >= 1400) {
        setMaxIndex(6);
      } else if (width >= 1280) {
        setMaxIndex(5);
      } else if (width >= 1024) {
        setMaxIndex(4); // Medium screens
      } else if (width >= 768) {
        setMaxIndex(3); // Smaller screens
      } else if (width >= 640) {
        setMaxIndex(2); // Smaller screens
      } else {
        setMaxIndex(2); // Very small screens
      }
    };

    updateMaxIndex(); // Set initial value based on window width
    window.addEventListener("resize", updateMaxIndex); // Update maxIndex on window resize

    return () => {
      window.removeEventListener("resize", updateMaxIndex); // Cleanup on component unmount
    };
  }, [window?.location]);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="bg-gray-500">
      {/* News Letter  */}
      <Wrapper classes="flex flex-row items-center justify-center py-5">
        <img
          className="hidden sm:block"
          src={process.env.PUBLIC_URL + "/images/footer/newsletter.png"}
          alt="newsletter"
        />
        <div className="mx-10 hidden md:block">
          <h4 className="text-black-100  md:text-[16px] lg:text-[1.375rem] font-semibold">
            Learn first about discounts
          </h4>
          <p className="md:text-[14px]  lg:text-[0.937rem]  text-gray-700 ">
            As well as news, special offers and promotions
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative hidden sm:block w-[100%] sm:w-full md:w-full lg:w-1/3"
        >
          <input
            className="w-full py-[16px] pr-44 pl-5 text-[0.95rem] text-gray-800 rounded-md border border-gray-300 outline-none"
            type="email"
            // value={formData.email}
            // onChange={handleInputChange}
            placeholder="Enter your email address"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
          <button
            type="submit"
            className="right-2 absolute top-[8px] text-base font-semibold bg-secondary rounded-sm px-7 py-2"
          >
            Subscribe
          </button>
        </form>
        {window?.innerWidth < 640 && (
          <div className="flex flex-col">
            <h1 className="text-[16px] leading-[18.77px] font-semibold py-[10px]">
              Subscribe Our News Letter
            </h1>
            <form
              onSubmit={handleSubmit}
              className="relative block w-[100%] sm:w-1/3"
            >
              <input
                className="w-full py-[16px] pr-44 pl-5 text-[0.95rem] text-gray-800  rounded-md border border-gray-300 outline-none"
                type="email"
                // value={formData.email}
                // onChange={handleInputChange}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              <button
                type="submit"
                className="right-2 absolute top-[8px] text-base font-semibold bg-secondary rounded-sm px-7 py-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        )}
      </Wrapper>
      <hr />
      <Wrapper classes="pt-0 lg:pt-7 pb-0 lg:pb-10 xxs:px-0 xs:px-0 sm:px-0 md:px-[10px]">
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
            {footerMenu.slice(0, maxIndex)?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="border-t lg:border-none mt-3 text-black-100"
                >
                  <h4 className="mt-[20px] text-[18px] leading-[21.11px] font-normal">
                    {item.name}
                  </h4>
                  <ul>
                    {item?.menu_nodes?.map((menu, index) => (
                      <li
                        key={index}
                        className="text-[15px] leading-[24px] font-light text-[#64748B] my-[10px]"
                      >
                        <Link to={menu?.url}>{menu?.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div className="block sm:hidden w-full">
          <div className="space-y-2">
            {footerMenu.map((item, index) => {
              return (
                <div key={item.id} className="border-b text-black-100">
                  {/* Dropdown Header */}
                  <div
                    className="flex  justify-between items-center px-4 py-3 cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    <h4 className="text-[16px] font-normal text-[#030303]">
                      {item.name}
                    </h4>
                    <img
                      className=""
                      src={`${process.env.PUBLIC_URL}/icons/arrow-down.png`}
                    />
                  </div>

                  {/* Dropdown Content */}
                  <ul
                    className={`transition-all duration-300 overflow-hidden px-4 ${
                      openIndex === index
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item?.menu_nodes?.map((menu, i) => (
                      <li
                        key={i}
                        className="text-[14px] font-light text-[#64748B] py-2"
                      >
                        <Link to={menu?.url} className="">
                          {menu?.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Wrapper>
      <hr />

      {/* Bottom Navigation  */}

      <Wrapper classes="flex flex-col items-start items-center inline-block sm:flex justify-between py-8 sm:flex-row">
        <div className="text-sm text-gray-700 ">
          © 2024,{" "}
          <Link to="#" className="font-bold text-primary">
            {" "}
            Horeca Store AE{" "}
          </Link>{" "}
          All rights reserved
        </div>
        <div className="hidden lg:block">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center mx-5 hidden sm:flex m-[10px]">
              <img
                src={process.env.PUBLIC_URL + "/icons/phone.png"}
                alt="Horeca Store"
              />
              <div className="ml-3">
                <p className="text-primary text-[1.625rem] font-bold leading-6">
                  1900 - 6666
                </p>
                <span className="text-xs text-gray-700 font-semibold">
                  Working 8:00 - 22:00
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center mx-5">
              <img
                src={process.env.PUBLIC_URL + "/icons/phone.png"}
                alt="Horeca Store"
              />
              <div className="ml-3">
                <p className="text-primary text-[1.625rem] font-bold leading-6">
                  1900 - 8888
                </p>
                <span className="text-xs text-gray-700 font-semibold">
                  24/7 Support Center
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  flex-col ">
          <h1 className="text-[22px] mb-[10px] leading-[25.81px] font-normal">
            Secured Payment Gateways
          </h1>
          <img
            className="w-[224px] "
            src={`${process.env.PUBLIC_URL}/images/footer/payment-method.svg`}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default React.memo(Footer);
