import React, { useEffect, useState, useMemo, } from "react";
import { Wrapper } from "../../shared/Wrapper";
import { FeatureHeader } from "../../shared/FeatureHeader";
import Skeleton from "react-loading-skeleton";
import debounce from "lodash.debounce";
import ProductCard from "../../shared/ProductCard";

const FeatureProduct = ({
  featureCat,
  featureCatList,
  selectedCat,
  featureCatLoader,
  setSelectedCat,
}) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [maxIndex, setMaxIndex] = useState(0);
  const smallScreenCss =
  "flex grid-cols-5 sm:grid md:grid lg:grid 2xl:grid gap-5 sm:gap-5 sm:grid sm:space-x-5 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5";

const bigScreenCss =
  "grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-5 gap-5 w-full";
  // Optimize resize event listener
  useEffect(() => {
    const updateMaxIndex = () => {
      const width = window.innerWidth;
      if (width >= 1600) setMaxIndex(10);
      else if (width >= 1536) setMaxIndex(8);
      else if (width >= 1400) setMaxIndex(8);
      else if (width >= 1280) setMaxIndex(8);
      else if (width >= 1024) setMaxIndex(6);
      else if (width >= 768) setMaxIndex(4);
      else setMaxIndex(10);
    };

    const debouncedResize = debounce(() => {
      setInnerWidth(window.innerWidth);
      updateMaxIndex();
    }, 200);

    window.addEventListener("resize", debouncedResize);
    updateMaxIndex();

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  const products = useMemo(() => {
    const filtered = featureCat
      .filter((product) => selectedCat === product.category_name)
      .map((product) => product.featured_products);
    return filtered[0] || [];
  }, [selectedCat, featureCat]);

  const gridClass = innerWidth > 640 ? bigScreenCss : smallScreenCss;


  return (
    <Wrapper>
      <FeatureHeader
        data={featureCatList}
        title="Featured Products"
        selectedItem={selectedCat}
        setSelectedItem={setSelectedCat}
        loader={featureCatLoader}
        classes="mt-8 mb-[10px] sm:mt-14 sm:mb-6"
      />
      <div
        className={gridClass}
        style={innerWidth < 640 ? { overflow: "auto", scrollbarWidth: "none" } : {}}
      >
        {featureCatLoader
          ? Array.from({ length: maxIndex }).map((_, index) => (
              <Skeleton key={index} className="col-span-1 mt-1 min-h-[550px] w-[150px]" />
            ))
          : products.length > 0
          ? products.slice(0, maxIndex).map((product, index) => (
                <ProductCard key={index} classes="col-span-1 mt-1" product={product}  />
        
            ))
          : (
            <p className="col-span-5 font-semibold text-center text-base">
              No Product Found
            </p>
          )}
      </div>
    </Wrapper>
  );
};

export default React.memo(FeatureProduct);
