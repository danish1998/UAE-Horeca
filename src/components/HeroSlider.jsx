import React, { useState } from "react";
import { apiClient } from "../utils/apiWrapper";
import { Hero } from "../hooks/hero/Hero";

const HeroSlider = () => {
  const [heroSlider, setHeroSlider] = useState([]);
  const [sliderLoader, setSliderLoader] = useState(true);
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

  return (
    <>
      {" "}
      <Hero heroSlider={heroSlider} sliderLoader={sliderLoader} />
    </>
  );
};

export default HeroSlider;
