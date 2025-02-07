import React from "react";
import { Wrapper } from "./Wrapper";

const HomepagePopularSearches = () => {
  const keywords = [
    "Kitchen Equipment", 
    "Pizza Ovens", 
    "Coffee Machines", 
    "Bar Supplies", 
    "Catering Equipment",
    "Kitchen Utensils",
    "Food Delivery Bags",
    "Grills",
    "Mixers",
    "Refrigerators",
    "Dishwashers",
    "Freezers",
    "Serving Trays",
    "Ovens",
    "Food Warmers",
    "Tupperware",
    "Blenders",
    "Fryers"
  ];

  return (
    <>
      <div className="bg-[#E2E8F0] h-[4px] w-full"></div>
      <Wrapper>
        <div className="my-[40px] w-full">
          <p className="ml-[5px]">Popular searches</p>
          <div className="flex flex-wrap">
            {/* Use map with index to dynamically render each keyword */}
            {keywords.map((item, index) => (
              <p
                key={index} // Using index as key
                className="m-[5px] px-[5px] border-[1px] text-[14px] font-light rounded-[4px] border-[#E2E8F0] text-[#64748B]"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default HomepagePopularSearches;
