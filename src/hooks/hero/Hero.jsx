import React from "react";
import { Wrapper } from "../../shared/Wrapper";
import Slider from "react-slick";
import { singleImageBanner } from "../../utils/slicksettings";
import {sideBanner } from "../../data/homepage";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { baseUrls } from "../../utils/apiWrapper";
export const Hero = ({ sliderLoader, heroSlider }) => {
  return (
    <Wrapper classes="mt-2 sm:mt-10 flex items-start justify-between flex-nowrap">
      <div className="grid lg:grid-cols-7 lg:gap-x-4 grid-cols-1">
        <div className="lg:col-span-5 col-span-1">
          {!sliderLoader ? (
            <Slider {...singleImageBanner} className="">
              {heroSlider &&
                heroSlider.map((banner, index) => (
                  <Link className="outline-none" key={index}>
                    <img
                      className="w-full rounded-md"
                      src={`${baseUrls}/storage/${banner?.image}`}
                      alt={banner.title}
                      to={`/${banner.link}`}
                    />
                  </Link>
                ))}
            </Slider>
          ) : (
            <Skeleton width={"100%"} height={"100%"} />
          )}
        </div>
        <div className="lg:col-span-2 col-span-1">
          <div className="flex flex-row lg:flex-col gap-2 lg:gap-4">
            {sideBanner.map((banner, index) => {
              return (
                <Link
                  key={index}
                  to={banner.redirectUrl}
                  className="w-full block object-contain"
                >
                  <img
                    src={banner.imgSource}
                    alt="Horeca Product Banner"
                    className="min-h-[0px] lg:min-h-[100px] xl:min-h-[180px] 2xl:min-h-[180px] 3xl:min-h-[180px] 4xl:min-h-[270px] rounded-md"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
