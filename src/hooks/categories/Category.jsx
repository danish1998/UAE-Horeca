import React from "react";
import { Link } from "react-router-dom";

export const Category = ({ category }) => {
  return (
    <Link
      to={"/collections/" + category.slug}
      className="xxs:max-h-[200] xxs:max-w-[290] sm:h-[260px] sm:max-w-[290px] md:w-[230px] relative font-semibold bg-gray-100 flex items-center justify-center flex-col hover:drop-shadow-lg p-3 text-center group rounded-md border border-gray-100 transition-all hover:border-primary"
    >
      <img
        className="max-h-[140px] max-w-[220] sm:w-[196px] sm:h-[196px] group-hover:brightness-105 transition-all"
        src={category.image}
        alt={category.name}
      />
      <p className="text-gray-700 text-[16px] sm:text-[12px] md:text-[18px] lg:text-[18px] xl:text-[18px] mt-[10px] font-normal ">
        {category.name}
      </p>
    </Link>
  );
};
