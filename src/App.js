import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { apiClient } from "./utils/apiWrapper";
import { ToastContainer } from "react-toastify";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FullScreenLoader } from "./shared/Loader";
import PrivateRoute from "./middelware/PrivateRoute";
import ReturnOrders from "./pages/ReturnOrder/ReturnOrders";
import SquareApp from "./pages/SquareApp";
import LoginOrder from "./pages/LoginOrder";
// Lazy load components
import Footer from './pages/Footer';
import Navigation from './pages/Navigation';
import Homepage from './pages/Homepage';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CollectionPage from './pages/CollectionPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SettingsLayout from './pages/settings/SettingsLayout';
import Checkout from './pages/checkout/Checkout';
import ReviewCheckout from './pages/checkout/ReviewCheckout';
import ProductsByCategory from './pages/ProductsByCategory';
import AllOrders from './pages/ProfileRegistration/AllOrders/AllOrders';
import Reviews from './pages/ProfileRegistration/Reviews/Reviews';
import BrowsingHistory from './pages/ProfileRegistration/BrowsingHistory/BrowsingHistory';
import CouponsOffers from './pages/ProfileRegistration/CouponeOffers/CouponsOffers';
import Addresses from './pages/ProfileRegistration/Addresses/Addresses';
import CreditBalance from './pages/ProfileRegistration/CreditBalance/CreditBalance';
import AccountSecurity from './pages/ProfileRegistration/AccountSecurity/AccountSecurity';
import OrderDetails from './pages/ProfileRegistration/OrderDetails/OrderDetails';
import ForgotPassword from './pages/ForgotPassword';
import ContactUs from './pages/FooterPages/ContactUs/ContactUs';
import FAQ from './pages/FooterPages/FAQ/Component/FAQ';
import TermsCondition from './pages/FooterPages/TermsAndConditions/TermsConsition';
import PrivacyPolicy from './pages/FooterPages/PrivacyPolicy/PrivacyPolicy';
import Career from './pages/FooterPages/Career/Career';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailed from './pages/payment/PaymentFailed';
import PasswordReset from './pages/PasswordReset';
import ProfileWishlist from './pages/ProfileRegistration/Wishlist/ProfileWishlist';
import Wishlist from './pages/Wishlist';
import SellOnHoreca from './pages/FooterPages/SellonHoreca/SellOnHoreca';
import AboutUs from './pages/AboutUs/AboutUs';
import BlogListing from './pages/BlogsPage/BlogListing';
import BlogDetails from './pages/BlogsPage/BlogDetails';
import AllCategories from "./pages/AllCategories";
import { findDefaultAddress } from "./utils/functions";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [currentLocation, setCurrentLocation] = useState({});
  const [menuCategory, setMenuCategory] = useState({});
 


  const fetchHomeCategories = async () => {

     try {
       const response = await apiClient.get("/home-categories");
       setMenuCategory(response.data);
     } catch (error) {
       console.error("Error:", error);
     } finally {
  
     }
   };

  const fetchCategories = async () => {
   // setLoader(true);
    try {
      const response = await apiClient.get("/categories-menu");
      setCategories(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
     // setLoader(false);
    }
  };
  const fetchUser = async () => {
   // setLoader(true);
    try {
      const response = await apiClient.get("/profile");
      setUserProfile(response.data.user);
    } catch (error) {
      console.error("Error:", error);
    } finally {
     // setLoader(false);
    }
  };

  useEffect(() => {
    fetchHomeCategories();
    fetchCategories();
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      fetchUser();
      
    }
    fetchLocations();

  }, []);
  
  

  const fetchLocations = async () => {
   // setLoader(true);
    try {
      const response = await apiClient.get(`/location`);
      setCurrentLocation(response.data);  
    } catch (error) {
      console.error("Error:", error);
    } finally {
     // setLoader(false);
    }
  };
 
  return (
    <>
     
        <Navigation
          categories={categories}
          menuCategory={menuCategory}
          currentLocation={currentLocation}
          userProfile={userProfile}
        />{" "}
            
        <Routes>
          <Route
            path="/home"
            element={
              <Homepage categories={menuCategory && menuCategory} />
            }
          />{" "}
          <Route
            path="/collections/:category/:subcategory/:id"
            element={<ProductsByCategory />}
          />{" "}
          {/* AllCategories */}
          <Route path="/checkout" element={<Checkout />} />{" "}
          <Route path="/all-categories" element={<AllCategories />} />{" "}
          <Route path="/" element={<Navigate replace to="/home" />} />{" "}
          <Route path="/products" element={<ProductListing />} />{" "}
          <Route path="/product/:id" element={<ProductDetail />} />{" "}
          <Route path="/collections/:id" element={<CollectionPage />} />{" "}
          <Route path="/settings" element={<SettingsLayout />} />{" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/loginOrder" element={<LoginOrder/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
          <Route path="/sign-up" element={<SignUp />} />{" "}
          <Route path="/review-checkout" element={<ReviewCheckout currentLocation={currentLocation} />} />{" "}
          <Route path="/wishlist" element={<Wishlist />} />{" "}
          <Route path="/contact-us" element={<ContactUs />} />{" "}
          <Route path="/faq" element={<FAQ />} />{" "}
          <Route path="/terms-condition" element={<TermsCondition />} />{" "}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />{" "}
          <Route path="/sell-on-horeca" element={<SellOnHoreca />} />{" "}
          <Route path="blog-listing" element={<BlogListing />} />
          <Route path="blog-details/:id" element={<BlogDetails />} />
          <Route path="/career" element={<Career />} />{" "}
          <Route path="/about-us" element={<AboutUs />} />{" "}
          <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
          <Route path="/password-reset" element={<PasswordReset />} />{" "}
          <Route path="/payment/success" element={<PaymentSuccess />} />{" "}
          <Route path="/square" element={<SquareApp />} />{" "}
          <Route path="/payment/cancel" element={<PaymentFailed />} />{" "}
          {/* Protected routes wrapped with PrivateRoute  ReturnOrders */}
          <Route path="/registration/all-orders" element={<PrivateRoute element={<AllOrders />} />} />
          <Route path="/registration/return-orders" element={<PrivateRoute element={<ReturnOrders />} />} />
          <Route path="/registration/reviews" element={<PrivateRoute element={<Reviews />} />} />
          <Route path="/registration/browsing-history" element={<PrivateRoute element={<BrowsingHistory />} />} />
          <Route path="/registration/wishlist" element={<PrivateRoute element={<ProfileWishlist />} />} />
          <Route path="/registration/wishlist" element={<PrivateRoute element={<ProfileWishlist />} />} />
          <Route path="/registration/coupons-offers" element={<PrivateRoute element={<CouponsOffers />} />} />
          <Route path="/registration/addresses" element={<PrivateRoute element={<Addresses />} />} />
          <Route path="/registration/creditBalance" element={<PrivateRoute element={<CreditBalance />} />} />
          <Route path="/registration/AccountSecurity" element={<PrivateRoute element={<AccountSecurity />} />} />
          <Route path="/order-details" element={<PrivateRoute element={<OrderDetails />} />} />
          {/* end Protected routes */}
          
        </Routes>{" "}

        <ToastContainer
          icon={<FaRegCircleCheck size={20} />}
          position="bottom-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          limit={3}
        />{" "}
        <Footer />
    
    </>
  );
};

export default App;