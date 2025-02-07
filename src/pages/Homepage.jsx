import React, { useState, useEffect } from "react";
import { Hero } from "../hooks/hero/Hero";
import { TimerBanner } from "../hooks/timerBanner/TimerBanner";
import { apiClient } from "../utils/apiWrapper";
import HomepageBanner from "../shared/HomepageBanner";
import HomepageContent from "../shared/HomepageContent";
import HomepagePopularSearches from "../shared/HomepagePopularSearches";
import FeatureProduct from "../hooks/featureproducts/FeatureProducts";
import FeatureBrand from "../hooks/featureBrand/FeatureBrand";
import BlogsCard from "../shared/BlogsCard";
import Categories from "../hooks/categories/Categories";

const Homepage = ({ categories }) => {
  const [featureCat, setFeatureCat] = useState([]);
  const [featureCatList, setFeatureCatList] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [featureCatLoader, setFeatureCatLoader] = useState(true);
  const [brandCat, setBrandCat] = useState([]);
  const [brandCatList, setBrandCatList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [heroSlider, setHeroSlider] = useState([]);
  const [sliderLoader, setSliderLoader] = useState(true);
  const [brandCatLoader, setBrandCatLoader] = useState(true);
  const authToken = localStorage.getItem("authToken");

  const fetchCategoriesProducts = async (tempCat) => {
    try {
      const response = await apiClient.get(
        `${authToken ? "/categoryproducts" : "categoryguestproducts"}`
      );
      setFeatureCat(response.data.data);
      response.data.data.map((item, index) => {
        index < 5 ? tempCat.push(item.category_name) : console.log("");
      });
      setFeatureCatList(tempCat);
      setSelectedCat(tempCat[0]);
      setFeatureCatLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  const fetchSlider = async () => {
    // setLoader(true);
    try {
      const response = await apiClient.get("/simple-slider/1");
      setHeroSlider(response.data.slider_items);

      setSliderLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      //   setLoader(false);
    }
  };

  const fetchBrandProducts = async (tempBrand) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await apiClient.get(
        `${authToken ? "/homebrandproducts" : "/brandguestproducts"}`
      );

      setBrandCat(response?.data?.data);
      response.data.data.map((item, index) => {
        index < 5 ? tempBrand.push(item.brand_name) : console.log("");
      });
      setBrandCatList(tempBrand);
      setSelectedBrand(tempBrand[0]);
      setBrandCatLoader(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      //   setLoader(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setSliderLoader(true);
    setFeatureCatLoader(true);
    setBrandCatLoader(true);
    let tempCat = [];
    let tempBrand = [];

    fetchCategoriesProducts(tempCat);
    fetchSlider();
    fetchBrandProducts(tempBrand);
  }, []);

  return (
    <div className="">
      <Hero heroSlider={heroSlider} sliderLoader={sliderLoader} />
      {/* <RowNews /> */}
      <Categories categories={categories} title={true} />
      <FeatureProduct
        featureCat={featureCat}
        featureCatList={featureCatList}
        selectedCat={selectedCat}
        featureCatLoader={featureCatLoader}
        setSelectedCat={setSelectedCat}
      />
      {/* for face two  */}

      <FeatureBrand
        brandCat={brandCat}
        brandCatList={brandCatList}
        selectedBrand={selectedBrand}
        brandCatLoader={brandCatLoader}
        setSelectedBrand={setSelectedBrand}
      />
      {/* <FeatureClearance /> */}
      <TimerBanner />
      <BlogsCard />
      <HomepageBanner />
      <HomepageContent />
      <HomepagePopularSearches />
    </div>
  );
};

export default React.memo(Homepage);
