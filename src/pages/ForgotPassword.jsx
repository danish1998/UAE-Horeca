import React, { useState,useEffect } from "react";
import { Wrapper } from "../shared/Wrapper";
import { Link } from "react-router-dom";
import { ButtonLoader } from "../shared/buttonLoader/ButtonLoader";
import { apiClient } from "../utils/apiWrapper";
import { notify } from "../utils/notify";
const ForgotPassword = () => {
  const authToken=localStorage.getItem('authToken');
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    setError(""); // Clear any existing errors
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) return; // Validate form before submitting
    try {
      setLoading(true);
      const response = await apiClient.post("/forgot-password", {
        email,
      });

      setEmailSent(true);
      notify("","Email sent successfully. Please check your mailbox.");
      setEmail('');
      // const token = response?.data?.token;
      // navigate("/password-reset", { state: token });
      setLoading(false);
    } catch (error) {
      setError("Verification Failed. Please check your Email.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if(authToken!=null){
     window.location.href="/home";
    }
    window.scrollTo(0, 0);
    
  }, []);
  return (
    <React.Fragment>
      <Wrapper>
        <div className="flex items-center justify-center w-full h-[60vh] mt-5 mb-5">
          <form
            className="bg-[#E2E8F04D] border-[#E2E8F0] rounded-[10px] border px-6 py-10 max-w-[550px]"
            onSubmit={handleFormSubmit}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl text-[#030303] font-semibold">
                Forgot Password
              </h3>
              <p className="text-[#000000] text-sm ">
                Please type your email for password reset
              </p>
            </div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full block mt-5 px-3 py-3 bg-[#FFFFFF66] text-[#212121] border ${
                error.includes("Email")
                  ? "border-red-500"
                  : "border-[#66666666]"
              } rounded-[4px]`}
            />

            {error.includes("Email") && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            {error.includes("Login") && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <p className="text-[#64748B] text-sm my-5 font-semibold"></p>
            <button
              type="submit"
              className="block w-full bg-primary text-white px-3 py-4 font-semibold text-base rounded-[4px] "
              disabled={loader}
              style={{ opacity: `${loader ? "0.5" : ""}` }}
            >
              {loader ? (
                <span className="flex items-center justify-center">
                  <ButtonLoader />
                </span>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
            <p className="mt-4 text-[#212121] text-sm">
              By registering you agree to the user{" "}
              <Link to="/terms-condition">
                <span className="font-semibold hover:text-green-500 ">
                  {" "}
                  Terms & Condition
                </span>{" "}
              </Link>
              and
              <Link to="/privacy-policy">
                {" "}
                <span className="font-semibold hover:text-green-500 ">
                  {" "}
                  Privacy Policy
                </span>
              </Link>
            </p>
          </form>
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default React.memo(ForgotPassword);
