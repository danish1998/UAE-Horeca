import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { apiClient } from "../../../../utils/apiWrapper";
import { InfinitySpin } from "react-loader-spinner";
import { notify } from "../../../../utils/notify";
const Popup = ({
  setShowPopup,
  popupHeading,
  items,
  setStatus,
  updateStatus,
}) => {
  const [loader, setLoader] = useState(false);
  const [getData, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userProfile"));

  const fetchCountry = async () => {
    try {
      const response = await apiClient.get("countries");
      setCountries(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleForm = async (data) => {
    const datas = {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      is_default: true,
    };
    Object.assign(datas, data);
    try {
      setLoader(true);
      let response;
      if (items) {
        response = await apiClient.put(`/addresses/${items.id}`, datas);
      } else {
        
        response = await apiClient.post(`/addresses`, datas);
      }

      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  };

  const schema = yup
    .object({
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      address: yup.string().required("Address is required"),
      zip_code: yup.string().required("Zip Code is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    handleForm(data);
    reset();
  };

  useEffect(() => {
    if (getData.success) {
      notify("", getData.message);
      setStatus(!updateStatus);
      setShowPopup(false);
    }
  }, [getData]);

  useEffect(() => {
    fetchCountry();
  }, []);

  return (
    <div>
      <div
        style={{ zIndex: "999" }}
        className="fixed inset-0 p-[10px] flex items-center justify-center z-999 backdrop-blur-sm"
      >
        <div className="modal-bg absolute inset-0 bg-gray-800 opacity-50"></div>
        <div className="modal relative bg-white w-[95%] sm:w-[650px] flex flex-col rounded-lg shadow-lg">
          <div className="flex items-center justify-between bg-[#DEF9EC] rounded-t-lg p-2">
            <p className="font-sans p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
              {popupHeading}
            </p>
            <button onClick={() => setShowPopup(false)}>X</button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-[5px]">
              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Select Country :
                </p>
                <select
                  id="country"
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  {...register("country", { required: "Country is required" })}
                >
                  {items?.country ? (
                    <option value={items.country} selected>
                      {items.country}
                    </option>
                  ) : (
                    <option value="">Select Country</option>
                  )}

                  {countries.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <span
                  className={"text-red-500 text-[14px] ml-[15px] font-semibold"}
                >
                  {errors.country?.message &&
                    errors.country.message.charAt(0).toUpperCase() +
                      errors.country.message.slice(1)}
                </span>
              </div>

              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Enter City :
                </p>
                <input
                  type="text"
                  defaultValue={items && items.city}
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  placeholder="Enter your city"
                  {...register("city")}
                />
                <span
                  className={"text-red-500 text-[14px] ml-[15px] font-semibold"}
                >
                  {errors.city?.message &&
                    errors.city.message.charAt(0).toUpperCase() +
                      errors.city.message.slice(1)}
                </span>
              </div>
              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Enter State :
                </p>
                <input
                  type="text"
                  defaultValue={items && items.state}
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  placeholder="Enter your state"
                  {...register("state")}
                />
                <span
                  className={"text-red-500 text-[14px] ml-[15px] font-semibold"}
                >
                  {errors.state?.message &&
                    errors.state.message.charAt(0).toUpperCase() +
                      errors.state.message.slice(1)}
                </span>
              </div>

              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Enter Zipcode :
                </p>
                <input
                  type="number"
                  defaultValue={items?.zip_code || ""}
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  placeholder="Enter your zipcode"
                  {...register("zip_code")}
                />
                <span
                  className={"text-red-500 text-[14px] ml-[15px] font-semibold"}
                >
                  {errors.zip_code?.message &&
                    errors.zip_code.message.charAt(0).toUpperCase() +
                      errors.zip_code.message.slice(1)}
                </span>
              </div>
              <div className="mt-[10px]">
                <p className="font-sans ml-[10px] p-[5px] text-base text-[#000000] font-medium leading-[21.11px] text-left decoration-skip-ink-none underline-offset-4">
                  Enter Address :
                </p>
                <textarea
                  type="text"
                  defaultValue={!!items && items ? items.address : ""}
                  className="border-2 rounded ml-[2%] p-[5px] w-[96%]"
                  placeholder="Enter your address"
                  {...register("address")}
                />
                <span
                  className={"text-red-500 text-[14px] ml-[15px] font-semibold"}
                >
                  {errors.address?.message &&
                    errors.address.message.charAt(0).toUpperCase() +
                      errors.address.message.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-end p-[15px]">
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex m-[10px] items-center justify-center rounded-md font-sans w-[180px] h-[40px] border border-[#666666] text-[16px] text-[#666666] font-medium leading-[16px] text-left underline-offset-auto decoration-slice"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex mb-[5px] bg-[#DEF9EC] items-center hover:text-green-500 justify-center rounded-md font-sans w-[180px] h-[40px] text-[#186737] text-[16px] font-medium leading-[16px] text-left underline-offset-auto decoration-slice"
                >
                  Submit
                </button>
                {loader ? (
                  <InfinitySpin
                    visible={true}
                    height="120"
                    width="120"
                    color="#186737"
                    ariaLabel="infinity-spin-loading"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;
