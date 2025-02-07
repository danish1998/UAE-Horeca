import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Wrapper } from "../shared/Wrapper";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { apiClient } from "../utils/apiWrapper";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader } from "../shared/Loader";

const Login = () => {
  const location = useLocation();
  const authToken=localStorage.getItem('authToken');
  let redirectTo = localStorage.getItem("redirectTo");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoading] = useState(false);
  const [guestUser, setGuestUser] = useState(false);
  const [showGuestAddress, setGuestAddress] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { currencyTitle, totalAmount } = location.state || {};

  const [getData, setData] = useState([]);

  const handlePayments = async (data) => {
    const datas = {
      amount: data.amount,
      // "currency": data.currency.toUpperCase(),
      currency: "USD",
      description: data.address,
      customer_name: data.name,
      customer_email: data.email,
    };

    try {
      setLoading(true);
      const response = await apiClient.post(`/create-payment`, datas);
      setData(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const schema = yup
    .object({
      number: yup
        .number()
        .transform((value, originalValue) => {
          if (originalValue === "") {
            return null; // or undefined if you prefer
          }
          return value;
        })
        .nullable()
        .notRequired()
        .positive("Number must be positive")
        .integer("Number must be an integer")
        .required("Mobile number is required"),

      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    })
    .required();

  //for address

  const schemaForAddress = yup
    .object({
      name: yup.string().required("Name is required"),
      country: yup.string().required("Country is required"),
      state: yup.string().required("State is required"),
      city: yup.string().required("City is required"),
      address: yup.string().required("Address is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit", // Trigger validation on submit
    reValidateMode: "onSubmit", // Revalidate only on submit
    defaultValues: {
      // Initialize form fields with empty values
      number: "",
      email: "",
    },
  });

  const onSubmit = (data) => {
    localStorage.setItem("guestUser", JSON.stringify(data));
    setGuestAddress(true);
    reset();
    reset2();
  };

  //for guest user address

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: error2 },
    reset: reset2,
  } = useForm({
    resolver: yupResolver(schemaForAddress),
  });

  const onSubmit2 = async (data) => {
    const guestInfo = JSON.parse(localStorage.getItem("guestUser")) || {}; // Ensure it doesn't throw an error if no guestUser exists
    await Object.assign(guestInfo, {
      amount: totalAmount,
      currency: currencyTitle,
    });
    await Object.assign(guestInfo, data);

    handlePayments(guestInfo);
    // Correctly store the object in localStorage
    localStorage.setItem("guestUser", JSON.stringify(guestInfo));
  };

  const LoginSchema = yup
    .object({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    })
    .required();

  const {
    register: loginForm,
    handleSubmit: loginSubmit,
    formState: { errors: loginError },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const loginSubmitForm = async (data) => {
    handleFormSubmit(data);
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);

      const datas = {
        email: data.email,
        password: data.password,
      };

      const response = await apiClient.post(`/login`, datas);

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("username", response.data.user.name);
      localStorage.setItem("userProfile", JSON.stringify(response.data.user));
if(redirectTo=='/forgot-password' || redirectTo=='/sign-up' || redirectTo=='/login'){
  redirectTo='/home';
}
      if (redirectTo) {
        navigate(redirectTo);
        localStorage.removeItem("redirectTo");
      } else {
        navigate("/home");
      }
      setLoading(false);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if(authToken!=null){
     window.location.href="/home";
    }
    window.scrollTo(0, 0);
    
  }, []);
  useEffect(() => {
    if (getData.status == "" && getData.redirect_url) {
      window.location.href = getData.redirect_url;
    }
  }, [getData]);



  return (
    <React.Fragment>
      <Wrapper>
        {loader ? (
          <div className="w-full h-[100vh] flex items-center justify-center bg-white fixed left-0 top-0 z-[999]">
            <Loader />
          </div>
        ) : null}
        <div className="flex items-center justify-center mb-[80px]">
          <div className="col-span-4 mt-16 ">
            <form
              className="bg-[#E2E8F04D] border-[#E2E8F0] rounded-[10px] mt-5 border px-6 py-10  max-w-[550px] min-h-[740px]  max-h-[740px]"
              onSubmit={loginSubmit(loginSubmitForm)}
            >
              <div className="text-center mb-10">
                <h3 className="text-2xl text-[#030303] font-semibold">
                  Returning Customers
                </h3>
                <p className="text-[#000000] text-sm">
                  Sign in for faster checkout.
                </p>
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                {...loginForm("email")}
                className={`w-full block mt-5 px-3 py-3 bg-[#FFFFFF66] text-[#212121] border ${
                  loginError.email ? "border-red-500" : "border-[#66666666]"
                } rounded-[4px]`}
              />
              {loginError.email && (
                <p className="text-red-500 text-sm">
                  {loginError?.email?.message}
                </p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  {...loginForm("password")}
                  className={`w-full block mt-5 px-3 py-3 bg-[#FFFFFF66] text-[#212121] border ${
                    loginError.password
                      ? "border-red-500"
                      : "border-[#66666666]"
                  } rounded-[4px] pr-12`}
                />
                <span
                  className="absolute top-1/2 right-5 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoMdEye size="24px" />
                  ) : (
                    <IoMdEyeOff size="24px" />
                  )}
                </span>
              </div>
              {loginError.password && (
                <p className="text-red-500 text-sm">
                  {loginError?.password?.message}
                </p>
              )}
              {error.includes("Login") && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <p
                onClick={() => navigate("/forgot-password")}
                className="cursor-pointer text-sm my-5 font-semibold hover:text-green-500"
              >
                Forgot Password?
              </p>
              <button
                type="submit"
                className="block w-full bg-primary text-white px-3 py-4 font-semibold text-base rounded-[4px] "
                disabled={loader}
                style={{ opacity: `${loader ? "0.5" : ""}` }}
              >
                <span>Login</span>
              </button>

              <span className="relative block text-center text-[22px] text-black my-7 after:absolute after:left-0 after:w-[40%] after:h-[1px] after:bg-[#E2E8F0] after:top-1/2 after:translate-y-[-50%] before:absolute before:right-0 before:w-[40%] before:h-[1px] before:bg-[#E2E8F0] before:top-1/2 before:translate-y-[-50%]">
                Or
              </span>

              <button className="border rounded-[4px] bg-[#FFFFFF66] border-[#03030399] font-semibold text-sm w-full py-3 px-3 flex items-center justify-center">
                <img
                  src={process.env.PUBLIC_URL + "/icons/apple.png"}
                  className="mr-2"
                  alt=""
                />
                Sign In with Apple
              </button>
              <button className="border rounded-[4px] bg-[#FFFFFF66] border-[#03030399] font-semibold text-sm w-full py-3 px-3 flex items-center justify-center mt-5">
                <img
                  src={process.env.PUBLIC_URL + "/icons/google.png"}
                  className="mr-2"
                  alt=""
                />
                Sign In with Outlook
              </button>
              <p className="mt-4 text-[#212121] text-sm">
                By registering you agree to the user{" "}
                <Link to="/terms-condition">
                  <span className="font-semibold hover:text-green-500">
                    Terms & Condition
                  </span>
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy">
                  <span className="font-semibold hover:text-green-500">
                    Privacy Policy
                  </span>
                </Link>
              </p>

              <p className="mt-4 text-sm ">
                Don’t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-primary font-semibold hover:text-green-500"
                >
                  Sign up now and join us!
                </Link>
              </p>
            </form>
          </div>
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default React.memo(Login);
