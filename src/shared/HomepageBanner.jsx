import React from "react";
import { Wrapper } from "./Wrapper";

const HomepageBanner = () => {
  return (
    <Wrapper>
      <div className="xxs:hidden sm:block rounded-md mb-[20px]">
        <img
          className="mb-[20px]"
          src={`${process.env.PUBLIC_URL}/images/HomePageLastBanner.png`}
        />
      </div>
    </Wrapper>
  );
};

export default HomepageBanner;
